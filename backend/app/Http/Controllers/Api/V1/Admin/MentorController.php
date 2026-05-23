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
    public function index()
    {
        $users = User::whereHas('mentorProfile', function ($query) {
            $query->where('status', 'pending');
        })
            ->latest()
            ->paginate(10);

        return $this->success(
            MentorApplicationResource::collection($users),
            'Pending mentor applications retrieved successfully.',
            200
        );
    }

    public function approve(User $user)
    {
        $mentorProfile = $user->mentorProfile()->where('status', 'pending')->first();

        if(!$mentorProfile){
            return $this->error('User does not have a pending mentor profile', 404);
        }

        $mentorProfile->update([
            'status' => 'approved',
        ]);

        $user->forceFill(['role' => 'mentor'])->save();

        return $this->success(new MentorApplicationResource($user->fresh(['mentorProfile'])), "Mentor application approved successfully" , 200);
    }

    public function reject(User $user)
    {
        $mentorProfile = $user->mentorProfile()->where('status', 'pending')->first();

        if(!$mentorProfile){
            return $this->error('User does not have a pending mentor profile', 404);
        }

        $mentorProfile->update([
            'status' => 'rejected',
        ]);

        $user->load('mentorProfile');

        return $this->success(new MentorApplicationResource($user), "Mentor application rejected successfully", 200);
    }
}
