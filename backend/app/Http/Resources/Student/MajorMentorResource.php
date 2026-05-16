<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MajorMentorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $sessions = $this->relationLoaded('user')
            && $this->user
            && $this->user->relationLoaded('mentorSessions')
                ? $this->user->mentorSessions
                : collect();

        $startingSession = $sessions->first();

        return [
            'name' => $this->user?->name,
            'avatar_url' => $this->user?->avatar_url,
            'bio' => $this->bio,
            'years_experience' => $this->years_experience,
            'degree' => $this->degree,
            'university_name' => $this->university_name,
            'graduation_year' => $this->graduation_year,
            'languages' => $this->languages,
            'linkedin_url' => $this->linkedin_url,
            'website_url' => $this->website_url,
            'is_accepting_students' => $this->is_accepting_students,
            'is_available' => $this->is_accepting_students && $sessions->isNotEmpty(),
            'starting_price' => $startingSession?->price,
            'currency' => $startingSession?->currency,
            'session_duration_minutes' => $startingSession?->duration_minutes,
            'active_sessions_count' => $sessions->count(),
        ];
    }
}
