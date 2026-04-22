<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('logs out the authenticated user and deletes the current token', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user, ['*']);

    $this->postJson('/api/v1/auth/logout')
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);

    $this->assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id,
    ]);
});

it('returns 401 when user is not authenticated', function () {
    $this->postJson('/api/v1/auth/logout')
        ->assertUnauthorized();
});

it('deletes only the current access token', function () {
    $user = User::factory()->create();

    $token1 = $user->createToken('mobile')->plainTextToken;
    $token2 = $user->createToken('web')->plainTextToken;

    $this->withHeader('Authorization', 'Bearer ' . $token1)
        ->postJson('/api/v1/auth/logout')
        ->assertOk();

    expect($user->tokens()->count())->toBe(1);
});