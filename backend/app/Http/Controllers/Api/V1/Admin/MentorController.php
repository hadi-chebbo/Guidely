<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\MentorApplicationResource;
use App\Models\MentorProfile;
use App\Models\User;
use App\Traits\ApiResponseTrait;

class MentorController extends Controller
{
    use ApiResponseTrait;
    public function show(User $user)
    {
        $user->load([
            'mentorProfile',
            'mentorSessions.availabilities',
        ]);

        return $this->success(
            new MentorApplicationResource($user),
            'Mentor Profile retrieved Successfully.',
            200
        );
    }
}
