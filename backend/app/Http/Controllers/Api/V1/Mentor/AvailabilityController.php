<?php

namespace App\Http\Controllers\Api\V1\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\StoreSessionAvailabilityRequest;
use App\Http\Resources\Mentor\AvailabilityResource;
use App\Models\MentorSession;
use App\Services\SessionAvailabilityService;
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

    public function store(
        StoreSessionAvailabilityRequest $request,
        MentorSession $session,
        SessionAvailabilityService $service
    ) {
        if ($session->user_id !== $request->user()->id) {
            return $this->error('Forbidden', 403);
        }

        $result = $service->createSlots(
            $session,
            $request->validated()['slots']
        );

        if ($result['all_conflicted']) {
            return $this->error(
                'All provided availability slots overlap with existing availabilities.',
                422
            );
        }

        $response = [
            'availabilities' => AvailabilityResource::collection(
                $result['created']
            ),
        ];

        if (!empty($result['conflicts'])) {
            $response['conflicted_indexes'] = $result['conflicts'];
        }

        return $this->success(
            $response,
            'Availability slots created successfully.',
            201
        );
    }
}
