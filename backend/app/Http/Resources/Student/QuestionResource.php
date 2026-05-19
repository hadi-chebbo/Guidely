<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'text_en' => $this->text_en,
            'text_ar' => $this->text_ar,

            'options' => QuestionOptionResource::collection(
                $this->whenLoaded('options')
            ),
        ];
    }
}
