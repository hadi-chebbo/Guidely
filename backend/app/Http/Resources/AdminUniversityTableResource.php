<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUniversityTableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_en' => $this->name_en,
            'slug' => $this->slug,
            'type' => $this->type,
            'location' => $this->location,
            'created_at' => $this->created_at,
        ];
    }
}
