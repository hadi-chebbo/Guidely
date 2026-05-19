<?php

namespace App\Http\Resources\Mentor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'major_slug' => $this->major?->slug,
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
            'major' => $this->whenLoaded('major', fn () => $this->major ? [
                'name_en' => $this->major->name_en,
                'name_ar' => $this->major->name_ar,
                'slug' => $this->major->slug,
            ] : null),
            'updated_at' => $this->updated_at,
        ];
    }
}
