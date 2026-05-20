<?php

use App\Models\MentorProfile;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);
beforeEach(function () {
    $this->admin = User::factory()->create([
        'role' => 'admin',
    ]);

    Sanctum::actingAs($this->admin);
});

it('retrieves a mentor profile successfully', function () {

    $user = User::factory()->create([
        'username' => 'john_doe',
    ]);

    MentorProfile::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved',
        'is_accepting_students' => true,
        'bio' => 'Test bio',
        'years_experience' => 3,
        'degree' => 'CS',
        'university_name' => 'Test University',
        'graduation_year' => 2022,
        'languages' => ['en', 'fr'],
        'linkedin_url' => 'https://linkedin.com',
        'website_url' => 'https://test.com',
    ]);

    $response = getJson(
        "/api/v1/admin/mentor-applications/{$user->username}"
    );

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Mentor Profile retrieved Successfully.',
        ])
        ->assertJsonStructure([
            'data' => [
                'user' => [
                    'id',
                    'name',
                    'username',
                    'email',
                ],

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
            ],
        ]);
});

it('returns 404 when mentor profile does not exist', function () {

    $response = getJson(
        '/api/v1/admin/mentor-applications/999999'
    );

    $response->assertNotFound();
});
