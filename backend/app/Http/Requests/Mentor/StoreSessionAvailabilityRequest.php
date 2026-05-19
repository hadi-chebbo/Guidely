<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Foundation\Http\FormRequest;

class StoreSessionAvailabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $session = $this->route('session');

        return $session && $session->user_id === $this->user()->id;
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
            'slots'                => ['required', 'array', 'min:1'],
            'slots.*.scheduled_at' => ['required', 'date_format:Y-m-d H:i:s', 'after:now'],
            'slots.*.ends_at'      => ['required', 'date_format:Y-m-d H:i:s', 'after:slots.*.scheduled_at'],
            'slots.*.timezone'     => ['sometimes', 'string', 'timezone'],
        ];
    }
}
