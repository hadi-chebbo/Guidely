<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use \Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponseTrait;
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::query()->where('email', $credentials['email'])->first();

        if (! Auth::attempt($credentials)) {
            return $this->error(
                'Invalid credentials.',
                401,
            );
        }

        if (!$user->hasVerifiedEmail()) {
        return $this->error(
            'Please verify your email before logging in.',
            403
        );
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success(
            [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ],
            'Logged in Successfully',
            200,
        );
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name'               => $data['name'],
            'email'              => $data['email'],
            'password'           => Hash::make($data['password']),
            'phone'              => $data['phone'] ?? null,
            'school'             => $data['school'] ?? null,
            'grade'              => $data['grade'] ?? null,
            'preferred_language' => $data['preferred_language'] ?? 'en',
            'onboarding_data'    => $data['onboarding_data'] ?? null,
        ]);

        EmailVerificationController::sendVerificationEmail($user);

        return $this->success(
            null,
            'User registered successfully. A verification email has been sent.',
            201,
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return $this->success(
            null,
            'Logged out Successfully',
            200
        );
    }
}
