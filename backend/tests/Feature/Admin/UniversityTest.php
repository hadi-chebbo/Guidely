<?php

use App\Models\Major;
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

it('requires authentication for admin universities show', function () {
    $university = University::factory()->create();

    $this->getJson("/api/v1/admin/universities/{$university->id}")
        ->assertUnauthorized();
});

it('requires authentication for admin universities update', function () {
    $university = University::factory()->create();

    $this->putJson("/api/v1/admin/universities/{$university->id}", [])
        ->assertUnauthorized();
});

it('returns paginated universities for admin users with default sorting and full fields', function () {
    $admin = User::factory()->admin()->create();

    $oldest = University::factory()->create([
        'name_en' => 'Oldest University',
        'name_ar' => 'الجامعة الأقدم',
        'slug' => 'oldest-university',
        'type' => 'public',
        'location' => 'Beirut',
        'website' => 'https://oldest.example.com',
        'logo_url' => 'https://cdn.example.com/oldest-logo.png',
        'description_en' => 'Oldest university description.',
        'description_ar' => 'وصف الجامعة الأقدم.',
        'founded_year' => 1950,
        'accreditation' => 'Local Accreditation',
        'created_at' => now()->subDays(3),
    ]);

    $middle = University::factory()->create([
        'name_en' => 'Middle University',
        'name_ar' => 'الجامعة الوسطى',
        'slug' => 'middle-university',
        'type' => 'private',
        'location' => 'Jounieh',
        'website' => 'https://middle.example.com',
        'logo_url' => 'https://cdn.example.com/middle-logo.png',
        'description_en' => 'Middle university description.',
        'description_ar' => 'وصف الجامعة الوسطى.',
        'founded_year' => 1970,
        'accreditation' => 'International Accreditation',
        'created_at' => now()->subDays(2),
    ]);

    $latest = University::factory()->create([
        'name_en' => 'Latest University',
        'name_ar' => 'الجامعة الأحدث',
        'slug' => 'latest-university',
        'type' => 'private',
        'location' => 'Byblos',
        'website' => 'https://latest.example.com',
        'logo_url' => 'https://cdn.example.com/latest-logo.png',
        'description_en' => 'Latest university description.',
        'description_ar' => 'وصف الجامعة الأحدث.',
        'founded_year' => 2000,
        'accreditation' => 'NECHE',
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
                    'name_ar',
                    'slug',
                    'type',
                    'location',
                    'website',
                    'logo_url',
                    'description_en',
                    'description_ar',
                    'founded_year',
                    'accreditation',
                    'created_at',
                    'updated_at',
                ],
            ],
            'links',
            'message',
            'meta',
        ])
        ->assertJsonPath('message', 'Universities retrieved successfully')
        ->assertJsonPath('data.0.id', $latest->id)
        ->assertJsonPath('data.0.name_en', 'Latest University')
        ->assertJsonPath('data.0.name_ar', 'الجامعة الأحدث')
        ->assertJsonPath('data.0.slug', 'latest-university')
        ->assertJsonPath('data.0.type', 'private')
        ->assertJsonPath('data.0.location', 'Byblos')
        ->assertJsonPath('data.0.website', 'https://latest.example.com')
        ->assertJsonPath('data.0.logo_url', 'https://cdn.example.com/latest-logo.png')
        ->assertJsonPath('data.0.description_en', 'Latest university description.')
        ->assertJsonPath('data.0.description_ar', 'وصف الجامعة الأحدث.')
        ->assertJsonPath('data.0.founded_year', 2000)
        ->assertJsonPath('data.0.accreditation', 'NECHE')
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
        ],
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

it('can show single university', function () {
    $admin = User::factory()->admin()->create();

    $university = University::factory()->create([
        'name_en' => 'American University of Beirut',
        'slug' => 'american-university-of-beirut',
        'type' => 'private',
        'location' => 'Beirut',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->getJson("/api/v1/admin/universities/{$university->id}");

    $response->assertStatus(200);

    $response->assertJson([
        'message' => 'University Fetched Successfully',
        'data' => [
            'id' => $university->id,
            'name_en' => 'American University of Beirut',
            'slug' => 'american-university-of-beirut',
            'type' => 'private',
            'location' => 'Beirut',
        ],
    ]);

    $response->assertJsonStructure([
        'message',
        'data' => [
            'id',
            'name_en',
            'name_ar',
            'slug',
            'type',
            'location',
            'website',
            'logo_url',
            'description_en',
            'description_ar',
            'founded_year',
            'accreditation',
            'created_at',
            'updated_at',
        ],
    ]);
});

it('returns 404 when university is not found', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    $this->getJson('/api/v1/admin/universities/999999')
        ->assertNotFound();
});

it('can update university', function () {
    $admin = User::factory()->admin()->create();

    $university = University::factory()->create([
        'name_en' => 'Old University Name',
        'slug' => 'old-university-name',
        'type' => 'public',
        'location' => 'Tripoli',
    ]);

    Sanctum::actingAs($admin);

    $payload = [
        'name_en' => 'Updated University Name',
        'name_ar' => 'جامعة محدثة',
        'slug' => 'updated-university-name',
        'type' => 'private',
        'location' => 'Beirut',
        'website' => 'https://www.updated.edu.lb',
        'logo_url' => 'https://cdn.example.com/updated-logo.png',
        'description_en' => 'Updated university description.',
        'description_ar' => 'وصف الجامعة المحدث.',
        'founded_year' => 1900,
        'accreditation' => 'NECHE',
    ];

    $response = $this->putJson("/api/v1/admin/universities/{$university->id}", $payload);

    $response
        ->assertOk()
        ->assertJsonPath('message', 'University Updated Successfully')
        ->assertJsonPath('data.id', $university->id)
        ->assertJsonPath('data.slug', 'updated-university-name')
        ->assertJsonPath('data.location', 'Beirut');

    $this->assertDatabaseHas('universities', [
        'id' => $university->id,
        'name_en' => 'Updated University Name',
        'slug' => 'updated-university-name',
        'type' => 'private',
        'location' => 'Beirut',
    ]);
});

it('validates required university fields on update', function () {
    $admin = User::factory()->admin()->create();
    $university = University::factory()->create();

    Sanctum::actingAs($admin);

    $response = $this->putJson("/api/v1/admin/universities/{$university->id}", []);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name_en',
            'slug',
            'type',
            'location',
        ]);
});

it('allows keeping the same slug when updating university', function () {
    $admin = User::factory()->admin()->create();

    $university = University::factory()->create([
        'slug' => 'same-university-slug',
    ]);

    Sanctum::actingAs($admin);

    $response = $this->putJson("/api/v1/admin/universities/{$university->id}", [
        'name_en' => $university->name_en,
        'name_ar' => $university->name_ar,
        'slug' => 'same-university-slug',
        'type' => $university->type,
        'location' => $university->location,
        'website' => $university->website,
        'logo_url' => $university->logo_url,
        'description_en' => $university->description_en,
        'description_ar' => $university->description_ar,
        'founded_year' => $university->founded_year,
        'accreditation' => $university->accreditation,
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.slug', 'same-university-slug');
});

it('rejects duplicate slug when updating university', function () {
    $admin = User::factory()->admin()->create();

    $existing = University::factory()->create([
        'slug' => 'taken-university-slug',
    ]);

    $university = University::factory()->create();

    Sanctum::actingAs($admin);

    $response = $this->putJson("/api/v1/admin/universities/{$university->id}", [
        'name_en' => $university->name_en,
        'name_ar' => $university->name_ar,
        'slug' => $existing->slug,
        'type' => $university->type,
        'location' => $university->location,
        'website' => $university->website,
        'logo_url' => $university->logo_url,
        'description_en' => $university->description_en,
        'description_ar' => $university->description_ar,
        'founded_year' => $university->founded_year,
        'accreditation' => $university->accreditation,
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['slug']);
});

it('returns empty array when university has no majors', function () {
    $user = User::factory()->admin()->create();

    Sanctum::actingAs($user);

    $university = University::factory()->create();

    $response = $this->getJson("/api/v1/admin/universities/{$university->id}/majors");

    $response->assertStatus(200)
        ->assertJson([
            'data' => []
        ]);
});
it('returns majors for a university', function () {
    $university = University::factory()->create();

    $majors = Major::factory()->count(3)->create([
        'university_id' => $university->id,
    ]);

    $response = $this->getJson("/api/v1/admin/universities/{$university->id}/majors");

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});