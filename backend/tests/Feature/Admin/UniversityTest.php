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

it('requires authentication for admin universities store', function () {
    $this->postJson('/api/v1/admin/universities', [])
        ->assertUnauthorized();
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

it('supports searching universities by english name', function () {
    $admin = User::factory()->admin()->create();

    University::factory()->create([
        'name_en' => 'American University of Beirut',
        'slug' => 'american-university-of-beirut',
    ]);

    University::factory()->create([
        'name_en' => 'Lebanese University',
        'slug' => 'lebanese-university',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities?search=American');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name_en', 'American University of Beirut');
});

it('supports searching universities by arabic name', function () {
    $admin = User::factory()->admin()->create();

    University::factory()->create([
        'name_en' => 'American University of Beirut',
        'name_ar' => 'الجامعة الأميركية في بيروت',
        'slug' => 'american-university-of-beirut',
    ]);

    University::factory()->create([
        'name_en' => 'Lebanese University',
        'name_ar' => 'الجامعة اللبنانية',
        'slug' => 'lebanese-university',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities?search=الأميركية');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name_en', 'American University of Beirut');
});

it('supports filtering universities by type', function () {
    $admin = User::factory()->admin()->create();

    University::factory()->create([
        'name_en' => 'Public University',
        'slug' => 'public-university',
        'type' => 'public',
    ]);

    University::factory()->create([
        'name_en' => 'Private University',
        'slug' => 'private-university',
        'type' => 'private',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities?type=public');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.type', 'public')
        ->assertJsonPath('data.0.name_en', 'Public University');
});

it('supports filtering universities by location', function () {
    $admin = User::factory()->admin()->create();

    University::factory()->create([
        'name_en' => 'Beirut University',
        'slug' => 'beirut-university',
        'location' => 'Beirut',
    ]);

    University::factory()->create([
        'name_en' => 'Tripoli University',
        'slug' => 'tripoli-university',
        'location' => 'Tripoli',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities?location=Beirut');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.location', 'Beirut')
        ->assertJsonPath('data.0.name_en', 'Beirut University');
});

it('keeps filters working with pagination', function () {
    $admin = User::factory()->admin()->create();

    $target = University::factory()->create([
        'name_en' => 'Filtered Page Two University',
        'slug' => 'filtered-page-two-university',
        'type' => 'private',
        'location' => 'Beirut',
        'created_at' => now()->subDay(),
    ]);

    University::factory()->count(15)->create([
        'type' => 'private',
        'location' => 'Beirut',
        'created_at' => now(),
    ]);

    University::factory()->count(3)->create([
        'type' => 'public',
        'location' => 'Tripoli',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities?type=private&location=Beirut&page=2');

    $response
        ->assertOk()
        ->assertJsonPath('meta.current_page', 2)
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonPath('meta.total', 16)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $target->id);
});

it('handles invalid university filters properly', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/universities?type=invalid-type');

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['type']);
});

it('can create university', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    $payload = [
        'name_en' => 'American University of Beirut',
        'name_ar' => 'الجامعة الأميركية في بيروت',
        'slug' => 'american-university-of-beirut',
        'type' => 'private',
        'location' => 'Beirut',
        'website' => 'https://www.aub.edu.lb',
        'logo_url' => 'https://cdn.example.com/aub-logo.png',
        'description_en' => 'A private research university in Beirut.',
        'description_ar' => 'جامعة بحثية خاصة في بيروت.',
        'founded_year' => 1866,
        'accreditation' => 'NECHE',
    ];

    $response = $this->postJson('/api/v1/admin/universities', $payload);

    $response->assertStatus(201);

    $response->assertJsonStructure([
        'data' => [
            'id',
            'name_en',
        ]
    ]);

    $this->assertDatabaseHas('universities', [
        'name_en' => 'American University of Beirut',
        'slug' => 'american-university-of-beirut',
        'type' => 'private',
        'location' => 'Beirut',
    ]);
});

it('cannot create university without required fields', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    $response = $this->postJson('/api/v1/admin/universities', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'name_en',
        'slug',
        'type',
        'location',
    ]);
});
