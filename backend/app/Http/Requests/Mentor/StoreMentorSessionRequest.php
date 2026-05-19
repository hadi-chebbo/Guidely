<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMentorSessionRequest extends FormRequest
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
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'type'             => ['required', 'in:one-on-one,group'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'max_capacity'     => ['required', 'integer', 'min:1'],
            'price'            => ['required', 'numeric', 'min:0'],
            'currency'         => ['required', 'string', 'size:3'],
            'is_active'        => ['sometimes', 'boolean'],
        ];
    }
    protected function prepareForValidation(): void
    {
        if ($this->input('type') === 'one-on-one') {
            $this->merge(['max_capacity' => 1]);
        }
    }
}
