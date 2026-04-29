<?php

namespace App\Http\Requests\Admin\University;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUniversityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:universities,slug'],
            'type' => ['required', 'in:public,private'],
            'location' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:500'],
            'logo_url' => ['nullable', 'string', 'max:500'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'founded_year' => ['nullable', 'integer'],
            'accreditation' => ['nullable', 'string', 'max:255'],
        ];
    }
}
