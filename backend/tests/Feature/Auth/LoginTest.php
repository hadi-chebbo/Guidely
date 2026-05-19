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
        ->assertJsonPath('message', 'Logged in Successfully')
        ->assertJsonPath('data.token_type', 'Bearer')
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.name', $user->name)
        ->assertJsonPath('data.user.email', $user->email)
        ->assertJsonPath('data.user.role', 'student');

    expect($response->json('data.token'))->not->toBeEmpty();

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

it('blocks login after multiple failed attempts', function () {

    $payload = [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ];

    // First 5 attempts should pass validation (even if credentials are wrong)
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/v1/auth/login', $payload)
            ->assertStatus(401); // unauthorized (wrong credentials)
    }

    // 6th attempt should trigger rate limiter
    $this->postJson('/api/v1/auth/login', $payload)
        ->assertStatus(429);
});