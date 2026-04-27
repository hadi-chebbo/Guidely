<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'avatar_url' => $this->avatar_url,
            'phone'              => $this->phone,
            'school'             => $this->school,
            'grade'              => $this->grade,
            'preferred_language' => $this->preferred_language,
            'is_premium' => $this->is_premium,
            'premium_expires_at' => $this->premium_expires_at,
            'onboarding_data'    => $this->onboarding_data,
            'created_at'         => $this->created_at->toDateTimeString(),
        ];
    }
}
