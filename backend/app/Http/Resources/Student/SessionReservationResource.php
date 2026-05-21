<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'status' => $this->status,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'availability' => $this->whenLoaded('sessionAvailability', function () {

                $availability = $this->sessionAvailability;

                return [
                    'uuid' => $availability->uuid,
                    'scheduled_at' => $availability->scheduled_at,
                    'ends_at' => $availability->ends_at,
                    'status' => $availability->status,

                    'session' => $this->whenLoaded('sessionAvailability', function () use ($availability) {

                        $session = $availability->session;

                        return [
                            'slug' => $session->slug,
                            'title' => $session->title,
                            'description' => $session->description,
                            'type' => $session->type,
                            'duration_minutes' => $session->duration_minutes,
                            'max_capacity' => $session->max_capacity,
                            'price' => $session->price,
                            'currency' => $session->currency,
                            'is_active' => $session->is_active,

                            'mentor' => $this->whenLoaded('sessionAvailability', function () use ($session) {

                                $mentor = $session->mentor;

                                return [
                                    'name' => $mentor?->name,
                                    'username' => $mentor?->username,
                                    'avatar_url' => $mentor?->avatar_url,
                                ];
                            }),
                        ];
                    }),
                ];
            }),
        ];
    }
}