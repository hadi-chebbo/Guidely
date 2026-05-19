<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversityResource extends JsonResource
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
            'type' => $this->type,
            'location' => $this->location,
            'website' => $this->website,
            'logo_url' => $this->logo_url,
            'description_en' => $this->description_en,
            'description_ar' => $this->description_ar,
            'founded_year' => $this->founded_year,

            'majors' => MajorResource::collection(
                $this->whenLoaded('majors')
            ),
        ];
    }
}
