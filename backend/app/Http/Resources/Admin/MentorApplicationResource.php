<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentorApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->relationLoaded('user') ? $this->user : null;
        $major = $this->relationLoaded('major') ? $this->major : null;

        return [
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
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'phone' => $user->phone,
            ] : null,
            'major' => $major ? [
                'id' => $major->id,
                'slug' => $major->slug,
                'name_en' => $major->name_en,
                'name_ar' => $major->name_ar,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
