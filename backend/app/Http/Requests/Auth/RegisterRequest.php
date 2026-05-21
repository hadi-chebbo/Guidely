<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
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
            'name'               => ['required', 'string', 'max:255'],
            'username'           => ['required','string','min:3','max:20','alpha_dash','unique:users,username',],
            'email'              => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'           => ['required', 'string', 'min:8', 'confirmed', 'regex:[A-Z]', 'regex:[0-9]'],
            'phone'              => ['nullable', 'string', 'max:20'],
            'school'             => ['nullable', 'string', 'max:255'],
            'grade'              => ['nullable', 'string', 'max:50'],
            'preferred_language' => ['nullable', 'in:en,ar'],
            'onboarding_data'    => ['nullable', 'array'],
        ];
    }

}
