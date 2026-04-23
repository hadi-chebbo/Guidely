<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponseTrait;
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return $this->error('Invalid credentials.', 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(
            'Logged in successfully',
            [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ],
        );
    }

public function register(RegisterRequest $request): JsonResponse
{
    $data = $request->validated();

    try {
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success(
            'User registered successfully',
            [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
            201
        );

    } catch (\Exception $e) {
        return $this->error(
            'Registration failed. Please try again.',
            500
        );
    }
}
    
}
