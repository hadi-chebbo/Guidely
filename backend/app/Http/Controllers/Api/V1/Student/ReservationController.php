<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\SessionReservationResource;
use App\Jobs\SendSessionReminderEmail;
use App\Models\MentorSession;
use App\Models\SessionAvailability;
use App\Models\User;
use App\Models\UserReservation;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class ReservationController extends Controller
{

    use ApiResponseTrait;

    public function cancel(UserReservation $reservation)
    {
        $user = auth()->user();

        if ($reservation->user_id !== $user->id) {
            return $this->error('You are not authorized to cancel this reservation.', 403);
        }

        if (in_array($reservation->status, ['cancelled', 'completed'])) {
            return $this->error("Cannot cancel a {$reservation->status} reservation.", 422);
        }

        $reservation->update([
            'status' => 'cancelled',
        ]);

        $reservation->load('sessionAvailability');

        if ($reservation->sessionAvailability) {
            $reservation->sessionAvailability->update([
                'is_booked' => false,
            ]);
        }

        // 5. Return updated model
        return $this->success(new SessionReservationResource($reservation->fresh()), 'Reservation cancelled successfully', 200);
    }

    public function index()
    {
        $user = auth()->user();

        $reservations = $user->reservations()
            ->with([
                'sessionAvailability.session.mentor'
            ])
            ->latest()
            ->paginate(10);

        return $this->success(
            SessionReservationResource::collection($reservations),
            'Reservations Retrieved Successfully',
            200
        );
    }

    public function book(SessionAvailability $availability)
    {
        $user = auth()->user();

        return DB::transaction(function () use ($availability, $user) {

            $availability = SessionAvailability::with('session')
                ->lockForUpdate()
                ->findOrFail($availability->id);

            if ($availability->status !== 'open') {
                return $this->error('This slot is not available', 409);
            }

            $session = $availability->session;

            // Prevent duplicate booking
            $alreadyBooked = UserReservation::where('user_id', $user->id)
                ->where('session_availability_id', $availability->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($alreadyBooked) {
                return $this->error('You already have a reservation for this slot', 409);
            }

            // Capacity check (safe inside lock)
            $currentCount = UserReservation::where('session_availability_id', $availability->id)
                ->whereIn('status', 'confirmed')
                ->count();

            if ($currentCount >= $session->max_capacity) {
                return $this->error('Session is full', 409);
            }

            // Route to correct handler
            if ($session->price === 0) {
                return $this->handleFreeBooking($user, $availability, $session);
            }

            return $this->handlePaidBooking($user, $availability, $session);
        });
    }

    private function handleFreeBooking(User $user, SessionAvailability $availability, MentorSession $session)
    {
        $reservation = $user->reservations()->create([
            'session_availability_id' => $availability->id,
            'status' => 'confirmed',
        ]);

        $reservation->load(['sessionAvailability.mentorSession']);

        $this->scheduleReminder($reservation, $availability);

        return $this->success(
            new SessionReservationResource($reservation),
            'Reservation confirmed',
            201
        );
    }

    private function handlePaidBooking(User $user, SessionAvailability $availability, MentorSession $session)
    {
        // Create pending reservation
        $reservation = $user->reservations()->create([
            'session_availability_id' => $availability->id,
            'status' => 'pending',
        ]);

        // Stripe setup
        Stripe::setApiKey(config('services.stripe.secret'));

        $paymentIntent = PaymentIntent::create([
            'amount' => (int) round($session->price * 100),
            'currency' => strtolower($session->currency),
            'metadata' => [
                'reservation_id' => $reservation->uuid,
            ],
        ], [
            'idempotency_key' => $reservation->uuid,
        ]);

        return $this->success([
            'reservation' => new SessionReservationResource($reservation),
            'client_secret' => $paymentIntent->client_secret,
        ], 'Payment required to confirm reservation', 200);
    }

    private function scheduleReminder(UserReservation $reservation, SessionAvailability $availability): void
    {
        $reminderAt = $availability->scheduled_at->subMinutes(5);

        if ($reminderAt->isFuture()) {
            SendSessionReminderEmail::dispatch($reservation)->delay($reminderAt);
        }
    }
}
