<?php

namespace App\Http\Controllers\Api\V1\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\StoreMentorSessionRequest;
use App\Http\Resources\Mentor\SessionResource;
use App\Models\MentorSession;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request): JsonResponse
    {
        $sessions = $request->user()
            ->mentorSessions()
            ->select([
                'id',
                'title',
                'description',
                'type',
                'duration_minutes',
                'max_capacity',
                'price',
                'currency',
                'is_active',
                'created_at',
                'updated_at',
            ])
            ->withCount('availabilities')
            ->latest()
            ->get();

        return $this->success(
            SessionResource::collection($sessions),
            'Mentor sessions retrieved successfully',
            200
        );
    }

    public function store(StoreMentorSessionRequest $request): JsonResponse
    {
        $session = $request->user()->mentorSessions()->create(
            $request->validated()
        );

        return $this->success(new SessionResource($session),'Session created successfully.',201);
    }
}
