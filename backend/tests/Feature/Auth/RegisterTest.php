<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows a user to register successfully', function () {

    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Fatima Janoun',
        'username' => 'fatimajanoun',
        'email' => 'fatima@test.com',
        'password' => 'Password_123',
        'password_confirmation' => 'Password_123',
        'phone' => '71234567',
        'school' => 'Lebanese University',
        'grade' => 'Senior',
        'preferred_language' => 'en',
    ]);

    $response
        ->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' ,
        ]);


    $this->assertDatabaseHas('users', [
        'email' => 'fatima@test.com',
        'name' => 'Fatima Janoun',
        'username' => 'fatimajanoun',
    ]);

    $this->assertDatabaseCount('users', 1);
});

it('fails when email already exists', function () {

    User::factory()->create([
        'email' => 'existing@test.com',
    ]);

    $this->postJson('/api/v1/auth/register', [
        'name' => 'New User',
        'email' => 'existing@test.com',
        'password' => 'Password_123',
        'password_confirmation' => 'Password_123',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

    $this->assertDatabaseCount('users', 1);
});

it('fails when username already exists', function () {

    User::factory()->create([
        'username' => 'existingusername',
    ]);

    $this->postJson('/api/v1/auth/register', [
        'name' => 'New User',
        'username' => 'existingusername',
        'email' => 'newuser@test.com',
        'password' => 'Password_123',
        'password_confirmation' => 'Password_123',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['username']);

    $this->assertDatabaseCount('users', 1);
});

it('validates registration request payload', function () {

    $this->postJson('/api/v1/auth/register', [
        'email' => 'invalid-email',
        'password' => '123',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name',
            'email',
            'password',
        ]);
});

it('throttles register requests after 5 attempts for same email and ip', function () {
    $payload = [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'Password_123',
        'password_confirmation' => 'Password_123',
    ];


    $this->postJson('/api/v1/auth/register', $payload)
        ->assertStatus(201);

    for ($i = 0; $i < 4; $i++) {
        $this->postJson('/api/v1/auth/register', $payload)
            ->assertStatus(422);
    }

    $response = $this->postJson('/api/v1/auth/register', $payload);

    $response->assertStatus(429);
});