<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\SessionReservationResource;
use App\Models\UserReservation;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    //
    use ApiResponseTrait;
    public function cancel(Request $request, UserReservation $reservation)
    {
        $user = $request->user();

        if ($reservation->user_id !== $user->id) {
            return $this->error('You are not authorized to cancel this reservation.',403);
        }

        if (in_array($reservation->status, ['cancelled', 'completed'])) {
            return $this->error("Cannot cancel a {$reservation->status} reservation.",422);
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
        return $this->success(new SessionReservationResource($reservation->fresh()),'Reservation cancelled successfully',200);
    }
}
