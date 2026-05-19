<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can get users', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    User::factory()->count(5)->create();

    $response = $this->getJson('/api/v1/admin/users');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Users Fetched Successfully',
        ]);
});

test('only admin can get users', function () {
    $user = User::factory()->student()->create();

    Sanctum::actingAs($user);
    $response = $this->getJson('/api/v1/admin/users');

    $response->assertStatus(403);
});

test('admin can get users by role', function() {
    $mentors = User::factory(5)->mentor()->create();

    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);
    $response = $this->getJson('/api/v1/admin/users?role=mentor');

    $response->assertStatus(200)
             ->assertJsonCount(5,'data')
             ->assertJsonFragment([
                'role' => 'mentor'
             ]);
});

test('users index returns paginated response structure', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    User::factory()->count(20)->create();

    $response = $this->getJson('/api/v1/admin/users');

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'data' => [
            '*' => [
                'id',
                'name',
                'email',
                'role',
                'avatar_url',
                'phone',
                'school',
                'grade',
                'preferred_language',
                'is_premium',
                'premium_expires_at',
                'onboarding_data',
                'created_at',
            ],
        ],
        'links' => [
            'first',
            'last',
            'prev',
            'next',
        ],
        'meta' => [
            'current_page',
            'from',
            'last_page',
            'links',
            'path',
            'per_page',
            'to',
            'total',
        ],
        'message',
    ]);

    $this->assertCount(15, $response->json('data'));
    $this->assertEquals(15, $response->json('meta.per_page'));
    $this->assertEquals('Users Fetched Successfully', $response->json('message'));
});

test('admin can toggle block user', function() {
    $admin = User::factory()->admin()->create();
    Sanctum::actingAs($admin);

    $user1 = User::factory()->student()->create([
        'is_blocked' => false,
    ]);

    $response1 = $this->patchJson("/api/v1/admin/users/{$user1->id}/toggleBlock");

    $response1->assertStatus(200);

    expect($user1->fresh()->is_blocked)->toBeTrue();

    $user2 = User::factory()->student()->create([
        'is_blocked' => true,
    ]);

    $response2 = $this->patchJson("/api/v1/admin/users/{$user2->id}/toggleBlock");

    $response2->assertStatus(200);

    expect($user2->fresh()->is_blocked)->toBeFalse();
});

test('only admin can block user', function() {
    $user = User::factory()->student()->create();
    $mentor = User::factory()->mentor()->create();

    $userToBeBlocked = User::factory()->student()->create([
        'is_blocked' => false,
    ]);
    Sanctum::actingAs($user);

    $response1 = $this->patchJson("/api/v1/admin/users/{$userToBeBlocked->id}/toggleBlock");

    $response1->assertStatus(403);

    Sanctum::actingAs($mentor);

    $response2 = $this->patchJson("/api/v1/admin/users/{$userToBeBlocked->id}/toggleBlock");

    $response2->assertStatus(403);

    expect($userToBeBlocked->fresh()->is_blocked)->toBeFalse();
});

test('admin can search user by username', function() {
    $admin = User::factory()->admin()->create();

    $user = User::factory()->student()->create([
        'username' => 'test_username'
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson("/api/v1/admin/users/search?username={$user->username}");

    $response->assertStatus(200);

    $response->assertJsonPath('data.0.username', $user->username);

});