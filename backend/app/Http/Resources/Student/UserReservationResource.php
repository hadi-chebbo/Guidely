<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $availability = $this->relationLoaded('sessionAvailability')
            ? $this->sessionAvailability
            : null;

        $session = $availability && $availability->relationLoaded('session')
            ? $availability->session
            : null;

        $mentor = $session && $session->relationLoaded('mentor')
            ? $session->mentor
            : null;

        return [
            'uuid' => $this->uuid,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'mentor_session' => $session ? [
                'slug' => $session->slug,
                'title' => $session->title,
                'description' => $session->description,
                'type' => $session->type,
                'duration_minutes' => $session->duration_minutes,
                'price' => $session->price,
                'currency' => $session->currency,
                'mentor' => $mentor ? [
                    'name' => $mentor->name,
                    'username' => $mentor->username,
                    'avatar_url' => $mentor->avatar_url,
                ] : null,
            ] : null,
            'availability_slot' => $availability ? [
                'uuid' => $availability->uuid,
                'scheduled_at' => $availability->scheduled_at,
                'ends_at' => $availability->ends_at,
                'status' => $availability->status,
                'timezone' => $availability->timezone,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
