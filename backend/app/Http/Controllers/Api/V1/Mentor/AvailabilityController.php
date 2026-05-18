<?php

namespace App\Http\Controllers\Api\V1\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Mentor\AvailabilityResource;
use App\Models\MentorSession;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request, MentorSession $session): JsonResponse
    {
        if ((int) $session->user_id !== $request->user()->id) {
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
}
