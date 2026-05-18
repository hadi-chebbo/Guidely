<?php

use App\Models\MentorSession;
use App\Models\SessionAvailability;
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

    Sanctum::actingAs($student);

    $this->getJson("/api/v1/mentor/sessions/{$session->slug}/availabilities")
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

    $response = $this->getJson("/api/v1/mentor/sessions/{$session->slug}/availabilities");

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Session availabilities retrieved successfully')
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.uuid',(string)  $earlierSlot->uuid)
        ->assertJsonPath('data.0.status', 'open')
        ->assertJsonPath('data.1.uuid', (string) $laterSlot->uuid)
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

    $this->getJson("/api/v1/mentor/sessions/{$otherSession->slug}/availabilities")
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

    $this->getJson("/api/v1/mentor/sessions/{$session->slug}/availabilities")
        ->assertOk()
        ->assertJsonPath('message', 'Session availabilities retrieved successfully')
        ->assertJsonCount(0, 'data');
});



/*
|--------------------------------------------------------------------------
| Store Tests
|--------------------------------------------------------------------------
*/

it('prevents mentor from adding slots to another mentor session', function () {

    $mentor      = User::factory()->mentor()->create();

    $otherMentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $otherMentor->id,
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [

        'slots' => [
            [
                'scheduled_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'ends_at'      => now()->addDays(10)->addHour()->format('Y-m-d H:i:s'),
                'timezone'     => 'Asia/Beirut',
            ],
        ],

    ])->assertForbidden();
});

it('creates availability slots and returns correct structure', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [

        'slots' => [
            [
                'scheduled_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'ends_at'      => now()->addDays(10)->addHour()->format('Y-m-d H:i:s'),
                'timezone'     => 'Asia/Beirut',
            ],
        ],

    ])
        ->assertCreated()
        ->assertJsonStructure([
            'data' => [
                'availabilities' => [
                    '*' => [
                        'scheduled_at',
                        'ends_at',
                        'status',
                        'timezone',
                    ],
                ],
            ],
        ]);
});

it('stores slots in the database linked to the session', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    $scheduledAt = now()->addDays(10)->format('Y-m-d H:i:s');

    $endsAt = now()->addDays(10)->addHour()->format('Y-m-d H:i:s');

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [

        'slots' => [
            [
                'scheduled_at' => $scheduledAt,
                'ends_at'      => $endsAt,
                'timezone'     => 'Asia/Beirut',
            ],
        ],

    ])->assertCreated();

    $this->assertDatabaseHas('session_availabilities', [
        'mentor_session_id' => $session->id,
        'scheduled_at'      => $scheduledAt,
        'ends_at'           => $endsAt,
        'status'            => 'open',
    ]);
});

it('returns unprocessable when all slots overlap', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $session->id,
        'scheduled_at'      => now()->addDays(10)->format('Y-m-d H:i:s'),
        'ends_at'           => now()->addDays(10)->addHour()->format('Y-m-d H:i:s'),
        'status'            => 'open',
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [

        'slots' => [
            [
                'scheduled_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'ends_at'      => now()->addDays(10)->addHour()->format('Y-m-d H:i:s'),
                'timezone'     => 'Asia/Beirut',
            ],
        ],

    ])
        ->assertUnprocessable()
        ->assertJsonPath(
            'message',
            'All provided availability slots overlap with existing availabilities.'
        );
});

it('stores valid slots and returns conflicted indexes for overlapping ones', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $session->id,
        'scheduled_at'      => now()->addDays(10)->format('Y-m-d H:i:s'),
        'ends_at'           => now()->addDays(10)->addHour()->format('Y-m-d H:i:s'),
        'status'            => 'open',
    ]);

    Sanctum::actingAs($mentor);

    $response = $this->postJson(
        "/api/v1/mentor/sessions/{$session->slug}/availabilities",
        [

            'slots' => [

                [
                    'scheduled_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
                    'ends_at'      => now()->addDays(10)->addHour()->format('Y-m-d H:i:s'),
                    'timezone'     => 'Asia/Beirut',
                ],

                [
                    'scheduled_at' => now()->addDays(11)->format('Y-m-d H:i:s'),
                    'ends_at'      => now()->addDays(11)->addHour()->format('Y-m-d H:i:s'),
                    'timezone'     => 'Asia/Beirut',
                ],
            ],
        ]
    );

    $response
        ->assertCreated()
        ->assertJsonPath('data.conflicted_indexes.0', 0);

    $this->assertDatabaseHas('session_availabilities', [
        'mentor_session_id' => $session->id,
        'status'            => 'open',
        'timezone'          => 'Asia/Beirut',
    ]);
});

it('requires slots to be present', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['slots']);
});

it('rejects slots where ends_at is before scheduled_at', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [

        'slots' => [
            [
                'scheduled_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'ends_at'      => now()->addDays(9)->format('Y-m-d H:i:s'),
                'timezone'     => 'Asia/Beirut',
            ],
        ],

    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'slots.0.ends_at',
        ]);
});

it('rejects slots scheduled in the past', function () {

    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->slug}/availabilities", [

        'slots' => [
            [
                'scheduled_at' => now()->subDay()->format('Y-m-d H:i:s'),
                'ends_at'      => now()->addHour()->format('Y-m-d H:i:s'),
                'timezone'     => 'Asia/Beirut',
            ],
        ],

    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'slots.0.scheduled_at',
        ]);
});