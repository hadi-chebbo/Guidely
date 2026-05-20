<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
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
            'is_active' => $this->active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'availabilities' => AvailabilityResource::collection(
                $this->whenLoaded('availabilities')
            ),
            'availabilities_count' => $this->availabilities_count ?? null,
        ];
    }
}
