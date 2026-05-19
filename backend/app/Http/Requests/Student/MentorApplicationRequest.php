<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class MentorApplicationRequest extends FormRequest
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
            'major_slug' => ['required', 'string', 'exists:majors,slug'],
            'bio'               => ['required', 'string', 'min:100', 'max:1000'],
            'years_experience'  => ['required', 'integer', 'min:0', 'max:50'],
            'degree'            => ['required', 'string', 'max:100'],
            'university_name'   => ['required', 'string', 'max:150'],
            'graduation_year'   => ['required', 'integer', 'min:1970', 'max:' . now()->year],
            'languages'         => ['required', 'array', 'min:1'],
            'languages.*'       => ['string', 'max:50'],
            'linkedin_url'      => ['nullable', 'url', 'max:255'],
            'twitter_url'       => ['nullable', 'url', 'max:255'],
            'website_url'       => ['nullable', 'url', 'max:255'],
            'is_accepting_students' => ['sometimes', 'boolean'],
        ];
    }
}
