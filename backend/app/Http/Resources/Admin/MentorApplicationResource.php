<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentorApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user' => new UserResource($this),

            'mentor_profile' => [
                'id' => $this->mentorProfile?->id,
                'major_id' => $this->mentorProfile?->major_id,
                'status' => $this->mentorProfile?->status,
                'is_accepting_students' => $this->mentorProfile?->is_accepting_students,
                'bio' => $this->mentorProfile?->bio,
                'years_experience' => $this->mentorProfile?->years_experience,
                'degree' => $this->mentorProfile?->degree,
                'university_name' => $this->mentorProfile?->university_name,
                'graduation_year' => $this->mentorProfile?->graduation_year,
                'languages' => $this->mentorProfile?->languages,
                'linkedin_url' => $this->mentorProfile?->linkedin_url,
                'website_url' => $this->mentorProfile?->website_url,
            ],
        ];
    }
}
