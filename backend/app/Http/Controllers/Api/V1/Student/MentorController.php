<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\PublicMentorResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    //
    use ApiResponseTrait;
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
