<?php

use App\Models\MentorSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to list mentor sessions', function () {
    $this->getJson('/api/v1/mentor/sessions')
        ->assertUnauthorized();
});

it('allows only mentors to list mentor sessions', function () {
    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    $this->getJson('/api/v1/mentor/sessions')
        ->assertForbidden();
});

it('returns only sessions owned by the authenticated mentor', function () {
    $mentor = User::factory()->mentor()->create();
    $otherMentor = User::factory()->mentor()->create();

    $ownSession = MentorSession::factory()->create([
        'user_id'          => $mentor->id,
        'title'            => 'College application review',
        'type'             => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity'     => 1,
        'price'            => 50,
        'currency'         => 'USD',
        'is_active'        => true,
    ]);

    MentorSession::factory()->create([
        'user_id'          => $mentor->id,
        'title'            => 'Portfolio planning group',
        'type'             => 'group',
        'duration_minutes' => 90,
        'max_capacity'     => 8,
        'price'            => 35,
        'currency'         => 'USD',
        'is_active'        => false,
    ]);

    MentorSession::factory()->create([
        'user_id' => $otherMentor->id,
        'title'   => 'Other mentor session',
    ]);

    Sanctum::actingAs($mentor);

    $response = $this->getJson('/api/v1/mentor/sessions');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Mentor sessions retrieved successfully')
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment([
            'slug'               => $ownSession->slug,
            'title'            => 'College application review',
            'type'             => 'one-on-one',
            'duration_minutes' => 60,
            'max_capacity'     => 1,
            'price'            => '50.00',
            'currency'         => 'USD',
            'is_active'        => true,
            'status'           => 'active',
        ])
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'slug',
                    'title',
                    'description',
                    'type',
                    'duration_minutes',
                    'max_capacity',
                    'price',
                    'currency',
                    'is_active',
                    'status',
                    'availabilities_count',
                    'created_at',
                    'updated_at',
                ],
            ],
            'message',
        ])
        ->assertJsonMissingPath('data.0.user_id')
        ->assertJsonMissingPath('data.1.user_id')
        ->assertJsonMissing(['title' => 'Other mentor session']);
});
it('returns an empty list when the mentor has no sessions', function () {
    $mentor = User::factory()->mentor()->create();

    Sanctum::actingAs($mentor);

    $this->getJson('/api/v1/mentor/sessions')
        ->assertOk()
        ->assertJsonPath('message', 'Mentor sessions retrieved successfully')
        ->assertJsonCount(0, 'data');
});


//StoreSessionTests
it('stores the session linked to the authenticated mentor', function () {
    $mentor = User::factory()->mentor()->create();
    Sanctum::actingAs($mentor);

    $this->postJson('/api/v1/mentor/sessions', [
        'title'            => 'Advanced Laravel Architecture',
        'description'      => 'A deep dive into Laravel service layers.',
        'type'             => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity'     => 1,
        'price'            => 99.99, 
        'currency'         => 'USD',
        'is_active'        => true,
    ])->assertCreated();

    $this->assertDatabaseHas('mentor_sessions', [
        'user_id' => $mentor->id,
        'title'   => 'Advanced Laravel Architecture',
    ]);
});
it('requires all mandatory fields', function () {
    Sanctum::actingAs(User::factory()->mentor()->create());

    $this->postJson('/api/v1/mentor/sessions', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'title', 'description', 'type',
            'duration_minutes', 'max_capacity', 'price', 'currency',
        ]);
});
it('respects max_capacity for group sessions', function () {
    Sanctum::actingAs(User::factory()->mentor()->create());

    $this->postJson('/api/v1/mentor/sessions', [
        'title'            => 'Laravel for Beginners',
        'description'      => 'Introductory group session covering routing and Eloquent.',
        'type'             => 'group',
        'duration_minutes' => 90,
        'max_capacity'     => 15,
        'price'            => 29.99,
        'currency'         => 'USD',
        'is_active'        => true,
    ])
        ->assertCreated()
        ->assertJsonPath('data.max_capacity', 15);
});
it('forces max_capacity to 1 for one-on-one sessions regardless of input', function () {
    Sanctum::actingAs(User::factory()->mentor()->create());

    $this->postJson('/api/v1/mentor/sessions', [
        'title'            => 'Advanced Laravel Architecture',
        'description'      => 'A deep dive into Laravel service layers.',
        'type'             => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity'     => 99,
        'price'            => 99.99,
        'currency'         => 'USD',
        'is_active'        => true,
    ])
        ->assertCreated()
        ->assertJsonPath('data.max_capacity', 1);

    $this->assertDatabaseHas('mentor_sessions', [
        'type'         => 'one-on-one',
        'max_capacity' => 1,
    ]);
});

it('prevents mentor from updating sessions they do not own', function () {
    $mentor = User::factory()->mentor()->create();
    $otherMentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->for($otherMentor, 'mentor')->create();

    Sanctum::actingAs($mentor);

    $response = $this->putJson("/api/v1/mentor/sessions/{$session->slug}", [
        'title' => 'Updated Title',
    ]);

    $response
        ->assertForbidden()
        ->assertStatus(403);
});

it('updates the mentor session successfully and regenerates the slug when the title changes', function () {
    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->for($mentor, 'mentor')->create([
        'title'   => 'Old Laravel Session',
        'slug'    => 'old-laravel-session-abc123',
    ]);

    Sanctum::actingAs($mentor);

    $response = $this->putJson("/api/v1/mentor/sessions/{$session->slug}", [
        'title'            => 'Advanced Laravel APIs',
        'description'      => 'Updated session description.',
        'duration_minutes' => 90,
        'price'            => 120,
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Session updated successfully')
        ->assertJsonPath('data.title', 'Advanced Laravel APIs')
        ->assertJsonPath('data.duration_minutes', 90);

    $session->refresh();

    expect($session->title)->toBe('Advanced Laravel APIs');
    expect($session->slug)->not->toBe('old-laravel-session-abc123');
    expect($session->slug)->toStartWith('advanced-laravel-apis');

    $this->assertDatabaseHas('mentor_sessions', [
        'id'    => $session->id,
        'title' => 'Advanced Laravel APIs',
    ]);
});