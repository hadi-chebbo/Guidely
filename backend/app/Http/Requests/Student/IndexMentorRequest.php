<?php

namespace App\Http\Requests\Student;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexMentorRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:100'],
            'major_slug' => ['nullable', 'string', 'exists:majors,slug'],
            'category_slug' => ['nullable', 'string', 'exists:categories,slug'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
