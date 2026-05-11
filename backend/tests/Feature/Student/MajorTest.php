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
