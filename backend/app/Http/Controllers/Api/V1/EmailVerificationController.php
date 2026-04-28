<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailMail;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Http\Requests\Auth\ResendRequest;

class EmailVerificationController extends Controller
{
    use ApiResponseTrait;

    public function verify(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!URL::hasValidSignature($request)) {
            return $this->error('Invalid or expired verification link.', 422);
        }

        if (!hash_equals($hash, sha1($user->email))) {
            return $this->error('Invalid verification link.', 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified. Please login.');
        }

        $user->markEmailAsVerified();

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success(
            [
                'token'      => $token,
                'token_type' => 'Bearer',
                'user'       => new UserResource($user),
            ],
            'Email verified successfully. You are now logged in.'
        );
    }

    public function resend(ResendRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

         if (!$user || $user->hasVerifiedEmail()) {
        return $this->success(
            null,
            'If the email exists, a verification link has been sent.'
        );
        }
    
        self::sendVerificationEmail($user);

        return $this->success(null, 'If the email exists, a verification link has been sent.');
    }

    public static function sendVerificationEmail(User $user): void
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id'   => $user->id,
                'hash' => sha1($user->email),
            ],
            absolute: true 
        );

        Mail::to($user->email)->send(
            new VerifyEmailMail($verificationUrl, $user->name)
        );
    }
}