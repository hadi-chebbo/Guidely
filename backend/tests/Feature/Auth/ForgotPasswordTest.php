<?php


use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns validation error when email format is invalid', function () {

    $response = $this->postJson('/api/v1/auth/forgot-password', [
        'email' => 'invalid-email',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});


it('returns validation error when email is missing', function () {

    $response = $this->postJson('/api/v1/auth/forgot-password', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});


