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

    
}
