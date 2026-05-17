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

    public function index(Request $request, int $session): JsonResponse
    {
        $mentorSession = MentorSession::query()
            ->select(['id'])
            ->whereKey($session)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $mentorSession) {
            return $this->error('Mentor session not found', 404);
        }

        $availabilities = $mentorSession->availabilities()
            ->select([
                'id',
                'uuid',
                'scheduled_at',
                'ends_at',
                'status',
                'timezone',
            ])
            ->orderBy('scheduled_at')
            ->orderBy('id')
            ->get();

        return $this->success(
            AvailabilityResource::collection($availabilities),
            'Session availabilities retrieved successfully',
            200
        );
    }
}
