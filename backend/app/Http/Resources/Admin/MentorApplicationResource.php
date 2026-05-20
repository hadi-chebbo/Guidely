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

            'id' => $this->id,
            'status' => $this->status,
            'is_accepting_students' => $this->is_accepting_students,
            'bio' => $this->bio,
            'years_experience' => $this->years_experience,
            'degree' => $this->degree,
            'university_name' => $this->university_name,
            'graduation_year' => $this->graduation_year,
            'languages' => $this->languages,
            'linkedin_url' => $this->linkedin_url,
            'website_url' => $this->website_url,
        ];
    }
}
