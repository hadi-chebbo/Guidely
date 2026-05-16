<?php

namespace App\Http\Controllers\Api\V1\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\MentorApplicationRequest;
use App\Http\Requests\Mentor\UpdateMentorRequest;
use App\Http\Resources\Mentor\MentorResource;
use App\Models\Major;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class MentorController extends Controller
{
    use ApiResponseTrait;

    public function update(UpdateMentorRequest $request): JsonResponse
    {
        $profile = $request->user()
            ->mentorProfile()
            ->with('major')
            ->first();

        if (! $profile) {
            return $this->error('Mentor profile not found', 404);
        }

        $data = $request->validated();

        if (array_key_exists('major_slug', $data)) {
            $data['major_id'] = $data['major_slug']
                ? Major::query()->where('slug', $data['major_slug'])->value('id')
                : null;

            unset($data['major_slug']);
        }

        $profile->update($data);

        return $this->success(
            new MentorResource($profile->fresh()->load('major')),
            'Mentor profile updated successfully',
            200
        );
    }

    public function apply(MentorApplicationRequest $request)
    {
        $user = $request->user();

        $majorId = Major::where('slug', $request->major_slug)->value('id');

        $data = collect($request->validated())
            ->except('major_slug')
            ->toArray();

        $data['major_id'] = $majorId;
        $data['status'] = 'pending';
        $data['is_accepting_students'] = $request->boolean(
            'is_accepting_students',
            false
        );

        if ($user->mentorProfile) {

            if ($user->mentorProfile->status === 'pending') {
                return $this->error(
                    'You already have a pending mentor application',
                    409
                );
            }

            if ($user->mentorProfile->status === 'approved') {
                return $this->error(
                    'You are already an approved mentor',
                    409
                );
            }

            $user->mentorProfile->update($data);

            $user->mentorProfile->load('major');

            return $this->success(
                new MentorResource($user->mentorProfile),
                'Your application has been re-submitted successfully.',
                200
            );
        }

        $mentorProfile = $user->mentorProfile()->create($data);

        $mentorProfile->load('major');

        return $this->success(
            new MentorResource($mentorProfile),
            'Your mentor application has been submitted successfully.',
            201
        );
    }
}
