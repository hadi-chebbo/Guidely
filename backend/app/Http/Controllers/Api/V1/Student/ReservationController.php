<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\SessionReservationResource;
use App\Models\UserReservation;
use App\Traits\ApiResponseTrait;

class ReservationController extends Controller
{
    //
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
}
