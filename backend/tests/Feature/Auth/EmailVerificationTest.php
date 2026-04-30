<?php

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;

uses(RefreshDatabase::class);

beforeEach(function () {
    Mail::fake();
});

it('returns success if email already verified', function () {

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $hash = sha1($user->email);

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => $hash,
        ]
    );

    $response = $this->getJson($url);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Email already verified. Please login.',
        ]);
});

it('verifies email and returns auth token', function () {

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    // simulate the same hash used in controller
    $hash = sha1($user->email);

    // generate valid signed URL (IMPORTANT)
    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => $hash,
        ]
    );

    // call verify endpoint
    $response = $this->getJson($url);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'token',
                'token_type',
                'user',
            ],
        ]);

    // user should now be verified
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('fails if email is already verified', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this->postJson('api/v1/auth/v1/email/resend', [
        'email' => $user->email,
    ]);

    $response->assertStatus(400)
        ->assertJson([
            'message' => 'Email is already verified.',
        ]);

    Mail::assertNothingSent();
});


it('validates email field', function () {
    $response = $this->postJson('api/v1/auth/v1/email/resend', [
        'email' => 'invalid-email',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});