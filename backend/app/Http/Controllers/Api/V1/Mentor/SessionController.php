<?php

namespace App\Http\Controllers\Api\V1\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\StoreMentorSessionRequest;
use App\Http\Requests\Mentor\UpdateMentorSessionRequest;
use App\Http\Resources\Mentor\SessionResource;
use App\Models\MentorSession;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request): JsonResponse
    {
        $sessions = $request->user()
            ->mentorSessions()
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

    public function update(UpdateMentorSessionRequest $request, MentorSession $session)
    {
        $data = $request->validated();

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        }

        $session->update($data);
        return $this->success(new SessionResource($session->fresh()), "Session updated successfully", 200);
    }
    public function destroy(Request $request, MentorSession $session)
    {
        $user = $request->user();

        $session = $user->mentorSessions()
            ->whereKey($session->id)
            ->first();

        if (! $session) {
            return $this->error('Session not found or unauthorized.', 404);
        }

        $session->delete();

        return $this->success(
            null,
            'Session deleted successfully.',
            200
        );
    }
}
