<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class PasswordController extends Controller
{
    use ApiResponseTrait;
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->success(
                'A reset link has been sent',
            );
        }

        try {
            $token = Password::getRepository()->create($user);

            Mail::to($user->email)->send(
                new ResetPasswordMail($token, $user->email)
            );

            return $this->success(
                'Reset email sent successfully'
            );

        } catch (\Exception $e) {
            return $this->error(
                'Failed to send reset email. Please try again.',
                500
            );
        }
    }

}
