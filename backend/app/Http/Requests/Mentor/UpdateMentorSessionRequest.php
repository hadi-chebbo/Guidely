<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMentorSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $session = $this->route('session');
        return $this->user()->id === $session->user_id;
    }

    public function rules(): array
    {
        return [
            'title'            => ['sometimes', 'string', 'max:255'],
            'description'      => ['sometimes', 'string'],
            'type'             => ['sometimes', 'in:one-on-one,group'],
            'duration_minutes' => ['sometimes', 'integer', 'min:15', 'max:480'],
            'max_capacity'     => ['sometimes', 'integer', 'min:1'],
            'price'            => ['sometimes', 'numeric', 'min:0'],
            'currency'         => ['sometimes', 'string', 'size:3'],
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
