<?php

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to update mentor profile', function () {
    $this->patchJson('/api/v1/mentor/profile', [])
        ->assertUnauthorized();
});

it('allows only mentors to update mentor profile', function () {
    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    $this->patchJson('/api/v1/mentor/profile', [])
        ->assertForbidden();
});

it('updates the authenticated mentors profile', function () {
    $mentor = User::factory()->mentor()->create();
    $major = Major::factory()->create();
    $newMajor = Major::factory()->create();

    $profile = MentorProfile::factory()->for($mentor)->for($major)->create([
        'status' => 'approved',
        'is_accepting_students' => true,
        'bio' => 'Old bio',
        'years_experience' => 2,
    ]);

    Sanctum::actingAs($mentor);

    $response = $this->patchJson('/api/v1/mentor/profile', [
        'major_slug' => $newMajor->slug,
        'is_accepting_students' => false,
        'bio' => 'Updated mentor bio',
        'years_experience' => 6,
        'degree' => 'Master',
        'university_name' => 'Lebanese University',
        'graduation_year' => 2020,
        'languages' => ['English', 'Arabic'],
        'linkedin_url' => 'https://www.linkedin.com/in/testmentor',
        'website_url' => 'https://mentor.example.com',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Mentor profile updated successfully')
        ->assertJsonPath('data.username', $mentor->username)
        ->assertJsonPath('data.is_accepting_students', false)
        ->assertJsonPath('data.bio', 'Updated mentor bio')
        ->assertJsonPath('data.years_experience', 6)
        ->assertJsonPath('data.languages.0', 'English')
        ->assertJsonPath('data.major.slug', $newMajor->slug)
        ->assertJsonMissingPath('data.major_id')
        ->assertJsonMissingPath('data.major.id');

    $this->assertDatabaseHas('mentor_profiles', [
        'id' => $profile->id,
        'user_id' => $mentor->id,
        'major_id' => $newMajor->id,
        'bio' => 'Updated mentor bio',
        'years_experience' => 6,
    ]);
});

it('does not allow mentor to update profile status', function () {
    $mentor = User::factory()->mentor()->create();
    $profile = MentorProfile::factory()->for($mentor)->create([
        'status' => 'pending',
    ]);

    Sanctum::actingAs($mentor);

    $this->patchJson('/api/v1/mentor/profile', [
        'major_slug' => $profile->major->slug,
        'bio' => 'Updated bio',
        'is_accepting_students' => true,
        'years_experience' => 4,
        'degree' => 'Bachelor',
        'university_name' => 'Lebanese University',
        'graduation_year' => 2020,
        'languages' => ['English'],
        'status' => 'approved',
    ])
        ->assertOk()
        ->assertJsonPath('data.status', 'pending');

    expect($profile->fresh()->status)->toBe('pending');
});

it('allows optional mentor profile links to be nullable', function () {
    $mentor = User::factory()->mentor()->create();
    $profile = MentorProfile::factory()->for($mentor)->create([
        'is_accepting_students' => true,
        'bio' => 'Old bio',
        'years_experience' => 4,
        'degree' => 'Bachelor',
        'university_name' => 'Old University',
        'graduation_year' => 2020,
        'languages' => ['English'],
        'linkedin_url' => 'https://www.linkedin.com/in/oldmentor',
        'website_url' => 'https://oldmentor.example.com',
    ]);

    Sanctum::actingAs($mentor);

    $this->patchJson('/api/v1/mentor/profile', [
        'major_slug' => $profile->major->slug,
        'is_accepting_students' => true,
        'bio' => 'Updated bio',
        'years_experience' => 5,
        'degree' => 'Master',
        'university_name' => 'Updated University',
        'graduation_year' => 2021,
        'languages' => ['English', 'Arabic'],
        'linkedin_url' => null,
        'website_url' => null,
    ])
        ->assertOk()
        ->assertJsonPath('data.linkedin_url', null)
        ->assertJsonPath('data.website_url', null);

    $this->assertDatabaseHas('mentor_profiles', [
        'id' => $profile->id,
        'linkedin_url' => null,
        'website_url' => null,
    ]);
});

it('returns not found when mentor has no profile', function () {
    $mentor = User::factory()->mentor()->create();

    Sanctum::actingAs($mentor);

    $major = Major::factory()->create();

    $this->patchJson('/api/v1/mentor/profile', [
        'bio' => 'Updated bio',
        'major_slug' => $major->slug,
        'is_accepting_students' => true,
        'years_experience' => 4,
        'degree' => 'Bachelor',
        'university_name' => 'Lebanese University',
        'graduation_year' => 2020,
        'languages' => ['English'],
    ])
        ->assertNotFound()
        ->assertJsonPath('message', 'Mentor profile not found');
});

it('validates mentor profile update payload', function () {
    $mentor = User::factory()->mentor()->create();
    MentorProfile::factory()->for($mentor)->create();

    Sanctum::actingAs($mentor);

    $this->patchJson('/api/v1/mentor/profile', [
        'major_slug' => null,
        'is_accepting_students' => null,
        'bio' => null,
        'years_experience' => -1,
        'degree' => null,
        'university_name' => null,
        'graduation_year' => 1800,
        'languages' => [],
        'website_url' => 'not-a-url',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'major_slug',
            'is_accepting_students',
            'bio',
            'years_experience',
            'degree',
            'university_name',
            'graduation_year',
            'languages',
            'website_url',
        ]);
});

it('allows authenticated mentor to get profile infos', function () {
    $mentor = User::factory()->mentor()->create();
    $major = Major::factory()->create();
    $mentor->mentorProfile()->create([
        'major_id' => $major->id,
        'status' => 'approved',
        'bio' => 'test bio',
        'years_experience' => 9,
        'degree' => 'test degree',
        'university_name' => 'test uni',
        'graduation_year' => 2019,
        'languages' => ['french'],
        'linkedin_url' => 'test url',
        'website_url' => 'test_website'
    ]);

    Sanctum::actingAs($mentor);

    $response = $this->getJson('api/v1/mentor/profile')->assertOK();

    $response->assertOk()
             ->assertJsonPath('data.bio', 'test bio')
             ->assertJsonPath('data.years_experience', 9)
             ->assertJsonPath('data.languages', ['french']);
});