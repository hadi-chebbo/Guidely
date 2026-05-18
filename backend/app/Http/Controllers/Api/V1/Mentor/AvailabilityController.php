<?php

namespace App\Http\Controllers\Api\V1\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Mentor\AvailabilityResource;
use App\Models\MentorSession;
use App\Models\SessionAvailability;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request, MentorSession $session): JsonResponse
    {
        if (!$this->authorizeSession($request, $session)) {
            return $this->error('Mentor session not found', 404);
        }

        $availabilities = $session->availabilities()
            ->orderBy('scheduled_at')
            ->get();

        return $this->success(
            AvailabilityResource::collection($availabilities),
            'Session availabilities retrieved successfully',
            200
        );
    }

    public function destroy(Request $request, MentorSession $session,SessionAvailability $availability)
    {
        if(!$this->authorizeSession($request, $session)){
            return $this->error('Mentor session not found', 404);
        }

        if ((int) $availability->mentor_session_id !== $session->id) {
            return $this->error('Availability not found', 404);
        }

        $availability->delete();

        return $this->success(null, 'Availability deleted successfully', 200);
    }

    private function authorizeSession(Request $request, MentorSession $session): bool
    {
        return (int) $session->user_id === $request->user()->id;
    }
}
