<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class PasswordController extends Controller
{
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'A reset password link has been sent'
            ], 200);
        }

        $token = Password::getRepository()->create($user);
        Mail::to($user->email)->send(new ResetPasswordMail($token, $user->email));

        return response()->json([
            'message' => 'Reset email sent successfully'
        ]);
    }

}
