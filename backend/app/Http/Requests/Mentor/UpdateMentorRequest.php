<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMentorRequest extends FormRequest
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
            'major_slug' => ['required', 'string', 'exists:majors,slug'],
            'is_accepting_students' => ['required', 'boolean'],
            'bio' => ['required', 'string', 'max:5000'],
            'years_experience' => ['required', 'integer', 'min:0', 'max:80'],
            'degree' => ['required', 'string', 'max:255'],
            'university_name' => ['required', 'string', 'max:255'],
            'graduation_year' => ['required', 'integer', 'min:1900', 'max:' . ((int) date('Y') + 10)],
            'languages' => ['required', 'array', 'min:1'],
            'languages.*' => ['required', 'string', 'max:50'],
            'linkedin_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'website_url' => ['sometimes', 'nullable', 'url', 'max:255'],
        ];
    }
}
