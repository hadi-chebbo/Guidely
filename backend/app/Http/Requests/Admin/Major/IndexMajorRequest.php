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
            'name_en'              => 'sometimes|string|max:255',
            'name_ar'              => 'sometimes|string|max:255',
            'category_id'          => 'sometimes|integer|exists:categories,id',
            'duration_years'       => 'sometimes|integer|min:1|max:16',
            'difficulty_level'     => 'sometimes|string|in:easy,medium,hard,very_hard',
            'salary_min'           => 'sometimes|numeric|min:0',
            'salary_max'           => 'sometimes|numeric|min:0|gte:salary_min',
            'local_demand'         => 'sometimes|string|in:low,medium,high,very_high',
            'international_demand' => 'sometimes|string|in:low,medium,high,very_high',
            'is_featured'          => 'sometimes|boolean',
        ];
    }
}
