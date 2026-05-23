<?php

namespace App\Http\Controllers\Api\V1\Stripe;

use App\Http\Controllers\Controller;
use App\Jobs\SendSessionReminderEmail;
use App\Models\UserReservation;
use Illuminate\Http\Request;
use Stripe\Webhook;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $secret
            );
        } catch (\Exception $e) {
            Log::error('Stripe Webhook Signature Error', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Invalid webhook signature'
            ], 400);
        }

        if ($event->type !== 'payment_intent.succeeded') {
            return response()->json(['ignored' => true], 200);
        }

        $paymentIntent = $event->data->object;

        $reservationId = $paymentIntent->metadata->reservation_id ?? null;

        if (!$reservationId) {
            Log::warning('Stripe webhook missing reservation_id', [
                'payment_intent_id' => $paymentIntent->id ?? null,
            ]);

            return response()->json(['ignored' => true], 200);
        }

        $reservation = UserReservation::where('uuid', $reservationId)->first();

        if (!$reservation) {
            Log::warning('Reservation not found from Stripe webhook', [
                'reservation_id' => $reservationId,
                'payment_intent_id' => $paymentIntent->id ?? null,
            ]);

            return response()->json(['not_found' => true], 404);
        }

        if ($reservation->status === 'confirmed') {
            return response()->json(['already_processed' => true], 200);
        }

        $reservation->update([
            'status' => 'confirmed',
        ]);

        $reservation->load('sessionAvailability');

        SendSessionReminderEmail::dispatch($reservation)
            ->delay($reservation->sessionAvailability->scheduled_at->subMinutes(5));

        Log::info('Stripe payment confirmed & reservation updated', [
            'reservation_id' => $reservation->id,
            'payment_intent_id' => $paymentIntent->id ?? null,
        ]);

        return response()->json(['success' => true], 200);
    }
}