<?php

use App\Models\MentorSession;
use App\Models\SessionAvailability;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('rejects unauthenticated requests', function () {
    $session = MentorSession::factory()->create();

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => '2026-06-01 10:00:00',
                'ends_at'      => '2026-06-01 11:00:00',
                'timezone'     => 'Asia/Beirut',
            ],
        ],
    ])->assertUnauthorized();
});

it('prevents mentor from adding slots to another mentor session', function () {
    $mentor      = User::factory()->mentor()->create();
    $otherMentor = User::factory()->mentor()->create();
    $session     = MentorSession::factory()->create(['user_id' => $otherMentor->id]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => '2026-06-01 10:00:00',
                'ends_at'      => '2026-06-01 11:00:00',
                'timezone'     => 'Asia/Beirut',
            ],
        ],
    ])->assertForbidden();
});

it('creates availability slots and returns correct structure', function () {
    $mentor  = User::factory()->mentor()->create();
    $session = MentorSession::factory()->create(['user_id' => $mentor->id]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => '2026-06-01 10:00:00',
                'ends_at'      => '2026-06-01 11:00:00',
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
                        'created_at',
                    ],
                ],

            ],
        ]);
});

it('stores slots in the database linked to the session', function () {
    $mentor  = User::factory()->mentor()->create();
    $session = MentorSession::factory()->create(['user_id' => $mentor->id]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => '2026-06-01 10:00:00',
                'ends_at'      => '2026-06-01 11:00:00',
                'timezone'     => 'Asia/Beirut',
            ],
        ],
    ])->assertCreated();

    $this->assertDatabaseHas('session_availabilities', [
        'mentor_session_id' => $session->id,
        'scheduled_at'      => '2026-06-01 10:00:00',
        'ends_at'           => '2026-06-01 11:00:00',
        'status'            => 'open',
    ]);
});

it('returns conflicted indexes when slots overlap', function () {
    $mentor  = User::factory()->mentor()->create();
    $session = MentorSession::factory()->create(['user_id' => $mentor->id]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $session->id,
        'scheduled_at'      => '2026-06-01 10:00:00',
        'ends_at'           => '2026-06-01 11:00:00',
        'status'            => 'open',
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => '2026-06-01 10:00:00',
                'ends_at'      => '2026-06-01 11:00:00',
                'timezone'     => 'Asia/Beirut',
            ],
        ],
    ])
        ->assertUnprocessable()
        ->assertJsonPath('message', 'All provided availability slots overlap with existing availabilities.');
});

it('saves valid slots and returns conflicted indexes for overlapping ones', function () {
    $mentor  = User::factory()->mentor()->create();
    $session = MentorSession::factory()->create(['user_id' => $mentor->id]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $session->id,
        'scheduled_at'      => '2026-06-01 10:00:00',
        'ends_at'           => '2026-06-01 11:00:00',
        'status'            => 'open',
    ]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => '2026-06-01 10:00:00', // conflicts
                'ends_at'      => '2026-06-01 11:00:00',
                'timezone'     => 'Asia/Beirut',
            ],
            [
                'scheduled_at' => '2026-06-01 14:00:00', // valid
                'ends_at'      => '2026-06-01 15:00:00',
                'timezone'     => 'Asia/Beirut',
            ],
        ],
    ])
        ->assertCreated()
        ->assertJsonPath('conflicted_indexes', null);
});

it('requires slots to be present', function () {
    $mentor  = User::factory()->mentor()->create();
    $session = MentorSession::factory()->create(['user_id' => $mentor->id]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['slots']);
});

it('rejects slots where ends_at is before scheduled_at', function () {
    $mentor  = User::factory()->mentor()->create();
    $session = MentorSession::factory()->create(['user_id' => $mentor->id]);

    Sanctum::actingAs($mentor);

    $this->postJson("/api/v1/mentor/sessions/{$session->id}/availabilities", [
        'slots' => [
            [
                'scheduled_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'ends_at'      => now()->addDays(9)->format('Y-m-d H:i:s'),
                'timezone'     => 'Asia/Beirut',
            ],
        ],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['slots.0.ends_at']);
});
