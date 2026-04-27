<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MajorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'overview' => $this->overview,
            'description' => $this->description,
            'duration_year' => $this->duration_years,
            'difficulty_level' => $this->difficulty_level,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'local_demand' => $this->local_demand,
            'international_demand' => $this->international_demand,
            'is_featured' => $this->is_featured,
            'cover_image' => $this->cover_image
        ];
    }
}
