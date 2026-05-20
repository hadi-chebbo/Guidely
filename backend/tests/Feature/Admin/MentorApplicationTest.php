<?php

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to list mentor applications', function () {
    $this->getJson('/api/v1/admin/mentor-applications')
        ->assertUnauthorized();
});

it('allows only admins to list mentor applications', function () {
    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    $this->getJson('/api/v1/admin/mentor-applications')
        ->assertForbidden();
});

it('returns pending mentor applications with user and profile summary', function () {
    $admin = User::factory()->admin()->create();
    $mentor = User::factory()->mentor()->create([
        'name' => 'Pending Mentor',
        'username' => 'pending-mentor',
        'email' => 'pending@example.com',
    ]);
    $major = Major::factory()->create([
        'slug' => 'computer-science',
        'name_en' => 'Computer Science',
    ]);

    $pendingApplication = MentorProfile::factory()
        ->for($mentor)
        ->for($major)
        ->create([
            'status' => 'pending',
            'bio' => 'I mentor students who want to understand software careers and university planning.',
            'years_experience' => 5,
            'degree' => 'Bachelor',
            'university_name' => 'American University of Beirut',
            'graduation_year' => 2018,
            'languages' => ['English', 'Arabic'],
        ]);

    MentorProfile::factory()->create(['status' => 'approved']);
    MentorProfile::factory()->create(['status' => 'rejected']);

    Sanctum::actingAs($admin);

    $response = $this->getJson('/api/v1/admin/mentor-applications');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Mentor applications retrieved successfully')
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $pendingApplication->id)
        ->assertJsonPath('data.0.status', 'pending')
        ->assertJsonPath('data.0.years_experience', 5)
        ->assertJsonPath('data.0.user.username', 'pending-mentor')
        ->assertJsonPath('data.0.user.email', 'pending@example.com')
        ->assertJsonPath('data.0.major.slug', 'computer-science')
        ->assertJsonPath('data.0.major.name_en', 'Computer Science')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'status',
                    'is_accepting_students',
                    'bio',
                    'years_experience',
                    'degree',
                    'university_name',
                    'graduation_year',
                    'languages',
                    'linkedin_url',
                    'website_url',
                    'user' => [
                        'id',
                        'name',
                        'username',
                        'email',
                        'avatar_url',
                        'phone',
                    ],
                    'major' => [
                        'id',
                        'slug',
                        'name_en',
                        'name_ar',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ],
            'links',
            'meta',
            'message',
        ]);
});

it('paginates mentor applications', function () {
    $admin = User::factory()->admin()->create();

    $olderApplication = MentorProfile::factory()->create([
        'status' => 'pending',
        'created_at' => now()->subMinute(),
    ]);

    $latestApplication = MentorProfile::factory()->create([
        'status' => 'pending',
        'created_at' => now(),
    ]);

    Sanctum::actingAs($admin);

    $this->getJson('/api/v1/admin/mentor-applications?per_page=1')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $latestApplication->id)
        ->assertJsonPath('meta.per_page', 1)
        ->assertJsonPath('meta.total', 2);

    expect($olderApplication->id)->not->toBe($latestApplication->id);
});
