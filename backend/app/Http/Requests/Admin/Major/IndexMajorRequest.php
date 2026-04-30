<?php

namespace App\Http\Requests\Admin\Major;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexMajorRequest extends FormRequest
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
            'name_en'              => 'sometimes',
            'name_ar'              => 'sometimes',
            'category_id'          => 'sometimes|exists:categories,id',
            'duration_years'       => 'sometimes|integer',
            'difficulty_level'     => 'sometimes',
            'salary_min'           => 'sometimes|numeric',
            'salary_max'           => 'sometimes|numeric',
            'local_demand'         => 'sometimes',
            'international_demand' => 'sometimes',
            'is_featured'          => 'sometimes|boolean',
        ];
    }
}
