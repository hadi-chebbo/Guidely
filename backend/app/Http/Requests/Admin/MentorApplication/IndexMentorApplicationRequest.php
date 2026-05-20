<?php

namespace App\Http\Requests\Admin\MentorApplication;

use Illuminate\Foundation\Http\FormRequest;

class IndexMentorApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
