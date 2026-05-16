<?php

namespace App\Http\Resources\Mentor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionAvailabilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'scheduled_at' => $this->scheduled_at->toDateTimeString(),
            'ends_at'      => $this->ends_at->toDateTimeString(),
            'status'       => $this->status,
            'timezone'     => $this->timezone,
            'created_at'   => $this->created_at->toISOString(),
        ];
    }
}
