<?php

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

describe('POST /api/v1/mentors/apply', function () {

    $payload = [
        'major_slug'            => 'computer-science',
        'bio'                   => 'I am a passionate software engineer with over 5 years of experience in full-stack development. I have mentored junior developers and helped students navigate their career paths in tech.',
        'years_experience'      => 5,
        'degree'                => 'Bachelor of Science in Computer Science',
        'university_name'       => 'American University of Beirut',
        'graduation_year'       => 2018,
        'languages'             => ['English', 'Arabic'],
        'linkedin_url'          => 'https://linkedin.com/in/johndoe',
        'twitter_url'           => 'https://twitter.com/johndoe',
        'website_url'           => 'https://johndoe.com',
        'is_accepting_students' => true,
    ];

    it('requires authentication', function () use ($payload) {
        $this->postJson('/api/v1/mentors/apply', $payload)
            ->assertStatus(401);
    });

    it('fails when graduation year is in the future', function () use ($payload) {
        Major::factory()->create(['slug' => 'computer-science']);
        $user = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', [
            ...$payload,
            'graduation_year' => now()->year + 1,
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['graduation_year']);
    });

    it('sets status to pending on creation', function () use ($payload) {
        Major::factory()->create(['slug' => 'computer-science']);
        $user = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', $payload)
            ->assertStatus(201);

        expect($user->fresh()->mentorProfile->status)->toBe('pending');
    });

    it('blocks duplicate application when status is approved', function () use ($payload) {
        Major::factory()->create(['slug' => 'computer-science']);
        $user = User::factory()->student()->create();
        MentorProfile::factory()->for($user)->create(['status' => 'approved']);
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', $payload)
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'You are already an approved mentor']);
    });

    it('allows reapplication when status is rejected', function () use ($payload) {
        Major::factory()->create(['slug' => 'computer-science']);
        $user = User::factory()->student()->create();
        MentorProfile::factory()->for($user)->create(['status' => 'rejected']);
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', $payload)
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Your application has been re-submitted successfully.']);

        expect($user->fresh()->mentorProfile->status)->toBe('pending');
    });

    it('does not create a new profile on reapplication', function () use ($payload) {
        Major::factory()->create(['slug' => 'computer-science']);
        $user = User::factory()->student()->create();
        MentorProfile::factory()->for($user)->create(['status' => 'rejected']);
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', $payload);

        expect(MentorProfile::where('user_id', $user->id)->count())->toBe(1);
    });

    it('resolves major by slug correctly', function () use ($payload) {
        $major = Major::factory()->create(['slug' => 'computer-science']);
        $user  = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', $payload)
            ->assertStatus(201);

        expect($user->fresh()->mentorProfile->major_id)->toBe($major->id);
    });

    it('fails with invalid major slug', function () use ($payload) {
        $user = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', [
            ...$payload,
            'major_slug' => 'non-existent-slug',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['major_slug']);
    });

    it('fails validation when required fields are missing', function () {
        $user = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'major_slug',
                'bio',
                'years_experience',
                'degree',
                'university_name',
                'graduation_year',
                'languages',
            ]);
    });

    it('fails when bio is too short', function () use ($payload) {
        $user = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', [
            ...$payload,
            'bio' => 'Too short',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['bio']);
    });


    it('accepts nullable social links', function () use ($payload) {
        Major::factory()->create(['slug' => 'computer-science']);
        $user = User::factory()->student()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/mentors/apply', [
            ...$payload,
            'linkedin_url' => null,
            'twitter_url'  => null,
            'website_url'  => null,
        ])->assertStatus(201);
    });
});
