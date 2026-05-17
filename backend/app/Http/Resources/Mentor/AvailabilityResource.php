<?php

namespace App\Http\Resources\Mentor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'scheduled_at' => $this->scheduled_at,
            'ends_at' => $this->ends_at,
            'status' => $this->status,
            'timezone' => $this->timezone,
        ];
    }
}
