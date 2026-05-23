<?php

namespace App\Http\Requests\Admin\University;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UniversityMajorRequest extends FormRequest
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
            //
            'major_id' => [
                'required',
                'exists:majors,id',
                Rule::unique('university_majors', 'major_id')
                    ->where(fn ($query) => $query->where('university_id', $this->route('university')->id)),
            ],

            'credit_price_usd' => ['required', 'numeric', 'min:0'],
            'total_credits' => ['required', 'integer', 'min:1'],
            'admission_requirements' => ['nullable', 'string'],
            'language_of_instruction' => ['required', 'string', 'max:255'],
            'has_scholarship' => ['required', 'boolean'],
            'campus' => ['nullable', 'string', 'max:255'],

        ];
    }
}
