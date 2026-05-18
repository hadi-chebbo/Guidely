<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\IndexMajorMentorRequest;
use App\Http\Requests\Student\MentorApplicationRequest;
use App\Http\Resources\Mentor\MentorResource;
use App\Http\Resources\Student\PublicMentorResource;
use App\Models\Major;
use App\Models\User;
use App\Traits\ApiResponseTrait;

class MentorController extends Controller
{
    //
    use ApiResponseTrait;

    public function indexByMajor(IndexMajorMentorRequest $request, Major $major)
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $mentors = User::query()
            ->where('role', 'mentor')
            ->whereHas('mentorProfile', fn ($query) => $query
                ->where('status', 'approved')
                ->where('major_id', $major->id))
            ->with(['mentorProfile.major'])
            ->paginate($perPage)
            ->withQueryString();

        return $this->success(
            PublicMentorResource::collection($mentors),
            'Major mentors retrieved successfully',
            200
        );
    }

    public function show(User $user)
    {
        $user->load('mentorProfile');

        if (
            $user->role !== 'mentor' ||
            !$user->mentorProfile ||
            $user->mentorProfile->status !== 'approved'
        ) {
            return $this->error('Mentor not found.', 404);
        }

        return $this->success(
            new PublicMentorResource($user),
            'Mentor retrieved successfully',
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
