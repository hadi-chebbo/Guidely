<?php

namespace App\Http\Controllers\Api\V1;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
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
                null,'If the email exists, a reset link has been sent.'
            );
        }

        try {
            $token = Password::getRepository()->create($user);
            Mail::to($user->email)->send(
                new ResetPasswordMail($token, $user->email)
            );

            return $this->success(
                null,'If the email exists, a reset email has been sent.'
            );

        } catch (\Exception $e) {
            return $this->error(
                'Failed to send reset email. Please try again.',
                500
            );
        }
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();
            }
        );
        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null,'Password has been reset successfully.');
        } 
        return $this->error('Failed to Reset Password', 400);    
    }
}
