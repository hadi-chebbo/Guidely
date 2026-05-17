<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to list session availabilities', function () {
    $this->getJson('/api/v1/mentor/sessions/1/availabilities')
        ->assertUnauthorized();
});

it('allows only mentors to list session availabilities', function () {
    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    $this->getJson('/api/v1/mentor/sessions/1/availabilities')
        ->assertForbidden();
});

it('returns ordered availability slots for an owned session', function () {
    $mentor = User::factory()->mentor()->create();
    $otherMentor = User::factory()->mentor()->create();

    $session = $mentor->mentorSessions()->create([
        'title' => 'College application review',
        'description' => 'Review student applications.',
        'type' => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity' => 1,
        'price' => 50,
        'currency' => 'USD',
        'is_active' => true,
    ]);

    $otherSession = $otherMentor->mentorSessions()->create([
        'title' => 'Other mentor session',
        'description' => 'Other mentor availability.',
        'type' => 'group',
        'duration_minutes' => 90,
        'max_capacity' => 5,
        'price' => 35,
        'currency' => 'USD',
        'is_active' => true,
    ]);

    $laterSlot = $session->availabilities()->create([
        'scheduled_at' => now()->addDays(3),
        'ends_at' => now()->addDays(3)->addHour(),
        'status' => 'full',
        'timezone' => 'Asia/Beirut',
    ]);

    $earlierSlot = $session->availabilities()->create([
        'scheduled_at' => now()->addDay(),
        'ends_at' => now()->addDay()->addHour(),
        'status' => 'open',
        'timezone' => 'Asia/Beirut',
    ]);

    $otherSlot = $otherSession->availabilities()->create([
        'scheduled_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addHour(),
        'status' => 'open',
        'timezone' => 'UTC',
    ]);

    Sanctum::actingAs($mentor);

    $response = $this->getJson("/api/v1/mentor/sessions/{$session->id}/availabilities");

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Session availabilities retrieved successfully')
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.uuid', $earlierSlot->uuid)
        ->assertJsonPath('data.0.status', 'open')
        ->assertJsonPath('data.1.uuid', $laterSlot->uuid)
        ->assertJsonPath('data.1.status', 'full')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'uuid',
                    'scheduled_at',
                    'ends_at',
                    'status',
                    'timezone',
                ],
            ],
            'message',
        ])
        ->assertJsonMissingPath('data.0.id')
        ->assertJsonMissingPath('data.0.mentor_session_id')
        ->assertJsonMissing(['uuid' => $otherSlot->uuid]);
});

it('does not allow mentors to list another mentors session availabilities', function () {
    $mentor = User::factory()->mentor()->create();
    $otherMentor = User::factory()->mentor()->create();

    $otherSession = $otherMentor->mentorSessions()->create([
        'title' => 'Other mentor session',
        'description' => 'Other mentor availability.',
        'type' => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity' => 1,
        'price' => 50,
        'currency' => 'USD',
        'is_active' => true,
    ]);

    Sanctum::actingAs($mentor);

    $this->getJson("/api/v1/mentor/sessions/{$otherSession->id}/availabilities")
        ->assertNotFound()
        ->assertJsonPath('message', 'Mentor session not found');
});

it('returns an empty list when the owned session has no availabilities', function () {
    $mentor = User::factory()->mentor()->create();

    $session = $mentor->mentorSessions()->create([
        'title' => 'College application review',
        'description' => 'Review student applications.',
        'type' => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity' => 1,
        'price' => 50,
        'currency' => 'USD',
        'is_active' => true,
    ]);

    Sanctum::actingAs($mentor);

    $this->getJson("/api/v1/mentor/sessions/{$session->id}/availabilities")
        ->assertOk()
        ->assertJsonPath('message', 'Session availabilities retrieved successfully')
        ->assertJsonCount(0, 'data');
});
