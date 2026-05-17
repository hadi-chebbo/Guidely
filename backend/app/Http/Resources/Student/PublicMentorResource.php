<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicMentorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile = $this->mentorProfile;

        return [
            'name'               => $this->name,
            'username'           => $this->username,
            'avatar_url'         => $this->avatar_url,
            'school'             => $this->school,
            'preferred_language' => $this->preferred_language,

            'profile' => $profile ? [
                'bio'                   => $profile->bio,
                'degree'                => $profile->degree,
                'university_name'       => $profile->university_name,
                'graduation_year'       => $profile->graduation_year,
                'years_experience'      => $profile->years_experience,
                'languages'             => $profile->languages,
                'is_accepting_students' => $profile->is_accepting_students,
                'major'                 => $profile->major
                    ? ['name' => $profile->major->name, 'slug' => $profile->major->slug]
                    : null,
                'social_links' => array_filter([
                    'linkedin' => $profile->linkedin_url,
                    'website'  => $profile->website_url,
                ]),
            ] : null,
        ];
    }
}
