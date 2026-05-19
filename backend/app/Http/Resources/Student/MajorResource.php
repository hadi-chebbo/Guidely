<?php

namespace App\Http\Resources\Student;

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
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'overview' => $this->overview,
            'description' => $this->description,
            'duration_years' => $this->duration_years,
            'difficulty_level' => $this->difficulty_level,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'local_demand' => $this->local_demand,
            'international_demand' => $this->international_demand,
            'is_featured' => $this->is_featured,
            'cover_image' => $this->cover_image,

            'category' => $this->whenLoaded('category', fn () => [
                'name_en' => $this->category->name_en,
                'name_ar' => $this->category->name_ar,
                'slug' => $this->category->slug,
            ]),

            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                ];
            })),
        ];
    }
}
