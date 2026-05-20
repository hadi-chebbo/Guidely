<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class IndexReservationRequest extends FormRequest
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
