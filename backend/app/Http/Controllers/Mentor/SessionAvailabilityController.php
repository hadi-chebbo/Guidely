<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\StoreSessionAvailabilityRequest;
use App\Http\Resources\Mentor\SessionAvailabilityResource;
use App\Models\MentorSession;
use App\Services\SessionAvailabilityService;
use App\Traits\ApiResponseTrait;

class SessionAvailabilityController extends Controller
{
    use ApiResponseTrait;

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
            'availabilities' => SessionAvailabilityResource::collection(
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
