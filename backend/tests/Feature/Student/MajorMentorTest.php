<?php

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns paginated approved mentors for a major publicly', function () {
    $major = Major::factory()->create([
        'slug' => 'computer-science',
    ]);

    $otherMajor = Major::factory()->create([
        'slug' => 'medicine',
    ]);

    $mentor = User::factory()->mentor()->create([
        'name' => 'Rana Mentor',
        'username' => 'rana-mentor',
        'avatar_url' => 'https://cdn.example.com/rana.png',
    ]);

    MentorProfile::factory()->for($mentor)->for($major)->create([
        'status' => 'approved',
        'is_accepting_students' => true,
        'bio' => 'Computer science mentor bio.',
        'years_experience' => 6,
        'degree' => 'Master',
        'university_name' => 'Lebanese University',
        'graduation_year' => 2020,
        'languages' => ['English', 'Arabic'],
    ]);

    $pendingMentor = User::factory()->mentor()->create([
        'name' => 'Pending Mentor',
    ]);

    MentorProfile::factory()->for($pendingMentor)->for($major)->create([
        'status' => 'pending',
        'bio' => 'Pending mentor bio.',
    ]);

    $otherMajorMentor = User::factory()->mentor()->create([
        'name' => 'Medicine Mentor',
    ]);

    MentorProfile::factory()->for($otherMajorMentor)->for($otherMajor)->create([
        'status' => 'approved',
        'bio' => 'Medicine mentor bio.',
    ]);

    $response = $this->getJson('/api/v1/majors/computer-science/mentors');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Major mentors retrieved successfully')
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Rana Mentor')
        ->assertJsonPath('data.0.username', 'rana-mentor')
        ->assertJsonPath('data.0.avatar_url', 'https://cdn.example.com/rana.png')
        ->assertJsonPath('data.0.profile.bio', 'Computer science mentor bio.')
        ->assertJsonPath('data.0.profile.years_experience', 6)
        ->assertJsonPath('data.0.profile.is_accepting_students', true)
        ->assertJsonPath('data.0.profile.major.slug', 'computer-science')
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonMissingPath('data.0.id')
        ->assertJsonMissingPath('data.0.user_id')
        ->assertJsonMissingPath('data.0.profile.major_id')
        ->assertJsonMissingPath('data.0.profile.status')
        ->assertJsonMissing(['name' => 'Pending Mentor'])
        ->assertJsonMissing(['name' => 'Medicine Mentor']);
});

it('supports mentor pagination for a major', function () {
    $major = Major::factory()->create([
        'slug' => 'engineering',
    ]);

    MentorProfile::factory()
        ->count(2)
        ->for($major)
        ->create([
            'status' => 'approved',
        ]);

    $response = $this->getJson('/api/v1/majors/engineering/mentors?per_page=1');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('meta.per_page', 1)
        ->assertJsonPath('meta.total', 2);
});

it('returns an empty list when a major has no approved mentors', function () {
    $major = Major::factory()->create([
        'slug' => 'business',
    ]);

    MentorProfile::factory()->for($major)->create([
        'status' => 'rejected',
    ]);

    $response = $this->getJson('/api/v1/majors/business/mentors');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Major mentors retrieved successfully')
        ->assertJsonCount(0, 'data');
});

it('validates the major slug and pagination query', function () {
    $response = $this->getJson('/api/v1/majors/missing-major/mentors?per_page=100');

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['major_slug', 'per_page']);
});
