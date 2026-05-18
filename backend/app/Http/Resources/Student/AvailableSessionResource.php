<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailableSessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'duration_minutes' => $this->duration_minutes,
            'max_capacity' => $this->max_capacity,
            'price' => $this->price,
            'currency' => $this->currency,
            'available_slots' => $this->whenLoaded('availabilities', fn () => $this->availabilities->map(fn ($availability) => [
                'uuid' => $availability->uuid,
                'scheduled_at' => $availability->scheduled_at,
                'ends_at' => $availability->ends_at,
                'timezone' => $availability->timezone,
            ])->values()),
        ];
    }
}
