<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('returns sanctum token and user data including role for valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'student@example.com',
        'password' => Hash::make('password123'),
        'role' => 'student',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'student@example.com',
        'password' => 'password123',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('token_type', 'Bearer')
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.name', $user->name)
        ->assertJsonPath('user.email', $user->email)
        ->assertJsonPath('user.role', 'student');

    expect($response->json('token'))->not->toBeEmpty();

    $this->assertDatabaseHas('personal_access_tokens', [
        'tokenable_id' => $user->id,
        'tokenable_type' => User::class,
    ]);
});

it('returns unauthorized for invalid credentials', function () {
    User::factory()->create([
        'email' => 'student@example.com',
        'password' => Hash::make('password123'),
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email' => 'student@example.com',
        'password' => 'wrong-password',
    ])
        ->assertUnauthorized()
        ->assertJson([
            'message' => 'Invalid credentials.',
        ]);

    $this->assertDatabaseCount('personal_access_tokens', 0);
});

it('validates login request payload', function () {
    $this->postJson('/api/v1/auth/login', [
        'email' => 'invalid-email',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});
