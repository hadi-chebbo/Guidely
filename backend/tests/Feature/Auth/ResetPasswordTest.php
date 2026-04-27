<?php

use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);
it('can reset password using valid token', function () {
    // 1. Create user (normal DB creation)
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    // 3. Generate reset token
    $token = Password::getRepository()->create($user);

    // 4. Call reset password API (NO auth required)
    $response = $this->postJson('/api/v1/auth/reset-password', [
        'email' => $user->email,
        'token' => $token,
        'password' => 'new-password123',
        'password_confirmation' => 'new-password123',
    ]);

    // 5. Assert success (ApiResponseTrait)
    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Password has been reset successfully.',
        ]);

    // 6. Assert password updated
    expect(Hash::check('new-password123', $user->fresh()->password))->toBeTrue();

    // 7. Token should no longer work
    $response2 = $this->postJson('api/v1/auth/reset-password', [
        'email' => $user->email,
        'token' => $token,
        'password' => 'another-password',
        'password_confirmation' => 'another-password',
    ]);

    $response2->assertStatus(400);
});

it('fails with invalid token', function () {

    $user = User::factory()->create();

    $response = $this->postJson('/api/v1/auth/reset-password', [
        'email' => $user->email,
        'token' => 'invalid-token',
        'password' => 'new-password123',
        'password_confirmation' => 'new-password123',
    ]);

    $response->assertStatus(400)
        ->assertJson([
            'message' => 'Failed to Reset Password',
        ]);
});

it('fails if email does not exist', function () {

    $response = $this->postJson('/api/v1/auth/reset-password', [
        'email' => 'notfound@example.com',
        'token' => 'some-token',
        'password' => 'new-password123',
        'password_confirmation' => 'new-password123',
    ]);

    $response->assertStatus(400);
});