<?php

use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication for admin universities index', function () {
    $this->getJson('/api/v1/admin/universities')
        ->assertUnauthorized();
});

it('forbids non admin users from viewing admin universities index', function () {
    Sanctum::actingAs(User::factory()->student()->create());

    $this->getJson('/api/v1/admin/universities')
        ->assertForbidden()
        ->assertJson([
            'message' => 'Forbidden.',
            'data' => null,
        ]);
});

it('returns paginated universities for admin users with default sorting and table fields', function () {
    $admin = User::factory()->admin()->create();

    $oldest = University::factory()->create([
        'name_en' => 'Oldest University',
        'slug' => 'oldest-university',
        'type' => 'public',
        'location' => 'Beirut',
        'created_at' => now()->subDays(3),
    ]);

    $middle = University::factory()->create([
        'name_en' => 'Middle University',
        'slug' => 'middle-university',
        'type' => 'private',
        'location' => 'Jounieh',
        'created_at' => now()->subDays(2),
    ]);

    $latest = University::factory()->create([
        'name_en' => 'Latest University',
        'slug' => 'latest-university',
        'type' => 'private',
        'location' => 'Byblos',
        'created_at' => now()->subDay(),
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities');

    $response
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name_en',
                    'slug',
                    'type',
                    'location',
                    'created_at',
                ],
            ],
            'links',
            'message',
            'meta',
        ])
        ->assertJsonPath('message', 'Universities retrieved successfully')
        ->assertJsonMissingPath('data.0.name_ar')
        ->assertJsonPath('data.0.id', $latest->id)
        ->assertJsonPath('data.1.id', $middle->id)
        ->assertJsonPath('data.2.id', $oldest->id)
        ->assertJsonPath('meta.per_page', 15);
});
