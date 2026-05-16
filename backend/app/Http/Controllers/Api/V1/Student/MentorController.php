<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\IndexMajorMentorRequest;
use App\Http\Resources\Student\PublicMentorResource;
use App\Models\Major;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    //
    use ApiResponseTrait;

    public function indexByMajor(IndexMajorMentorRequest $request)
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $major = Major::query()
            ->where('slug', $filters['major_slug'])
            ->first();

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
}
