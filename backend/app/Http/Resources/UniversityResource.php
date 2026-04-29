<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
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
            'accreditation' => $this->accreditation,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
