<?php

namespace App\Http\Requests\Admin\Major;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMajorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],

            'category_id' => ['required', 'exists:categories,id'],

            'slug' => ['required', 'string', 'max:255', 'unique:majors,slug'],

            'overview' => ['required', 'string'],
            'description' => ['required', 'string'],

            'duration_years' => ['required', 'integer', 'min:1'],

            'difficulty_level' => [
                'required',
                'in:easy,medium,hard,very_hard'
            ],

            'salary_min' => ['required', 'numeric', 'min:0'],
            'salary_max' => ['required', 'numeric', 'min:0'],

            'local_demand' => [
                'required',
                'in:low,medium,high,very_high'
            ],

            'international_demand' => [
                'required',
                'in:low,medium,high,very_high'
            ],

            'is_featured' => ['nullable', 'boolean'],

            'cover_image' => ['nullable', 'string', 'max:500'],

            'skills' => ['required', 'array'],
            'skills.*' => ['exists:skills,id'],
        ];
    }
}
