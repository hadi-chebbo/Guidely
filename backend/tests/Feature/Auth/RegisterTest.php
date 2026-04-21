<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows a user to register successfully', function () {

    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Fatima Janoun',
        'email' => 'fatima@test.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'phone' => '71234567',
        'school' => 'Lebanese University',
        'grade' => 'Senior',
        'preferred_language' => 'en',
    ]);

    $response
        ->assertCreated()
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => [
                    'id',
                    'name',
                    'email',
                ],
                'token',
            ],
        ]);

    expect($response->json('data.token'))->not->toBeEmpty();

    $this->assertDatabaseHas('users', [
        'email' => 'fatima@test.com',
        'name' => 'Fatima Janoun',
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
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

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