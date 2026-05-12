<?php

use App\Models\Major;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to get user favorite majors', function () {
    $this->getJson('/api/v1/user/favorites')
        ->assertUnauthorized();
});

it('returns the authenticated users favorite majors', function () {
    $user = User::factory()->student()->create();
    $otherUser = User::factory()->student()->create();

    $firstFavorite = Major::factory()->create([
        'name_en' => 'Computer Science',
    ]);
    $secondFavorite = Major::factory()->create([
        'name_en' => 'Medicine',
    ]);
    $otherFavorite = Major::factory()->create([
        'name_en' => 'Business Administration',
    ]);

    $user->favoriteMajors()->attach($firstFavorite->id, [
        'created_at' => now()->subMinute(),
        'updated_at' => now()->subMinute(),
    ]);
    $user->favoriteMajors()->attach($secondFavorite->id, [
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $otherUser->favoriteMajors()->attach($otherFavorite->id);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/user/favorites');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Favorite majors retrieved successfully')
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.name_en', 'Medicine')
        ->assertJsonPath('data.1.name_en', 'Computer Science')
        ->assertJsonMissing([
            'name_en' => 'Business Administration',
        ]);
});

it('requires authentication to toggle a major favorite', function () {
    $major = Major::factory()->create();

    $this->patchJson("/api/v1/majors/{$major->slug}/favorite")
        ->assertUnauthorized();
});

it('adds a major to favorites for the authenticated user', function () {
    $user = User::factory()->student()->create();
    $major = Major::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->patchJson("/api/v1/majors/{$major->slug}/favorite");

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Major added to favorites')
        ->assertJsonPath('data.is_favorite', true);

    $this->assertDatabaseHas('user_favorites', [
        'user_id' => $user->id,
        'major_id' => $major->id,
    ]);
});

it('removes a major from favorites when already favorited', function () {
    $user = User::factory()->student()->create();
    $major = Major::factory()->create();

    $user->favoriteMajors()->attach($major->id);

    Sanctum::actingAs($user);

    $response = $this->patchJson("/api/v1/majors/{$major->slug}/favorite");

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Major removed from favorites')
        ->assertJsonPath('data.is_favorite', false);

    $this->assertDatabaseMissing('user_favorites', [
        'user_id' => $user->id,
        'major_id' => $major->id,
    ]);
});

it('returns not found when toggling a missing major favorite', function () {
    $user = User::factory()->student()->create();

    Sanctum::actingAs($user);

    $this->patchJson('/api/v1/majors/missing-major/favorite')
        ->assertNotFound();
});
