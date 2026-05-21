<?php

use App\Models\User;
use App\Models\MentorSession;
use App\Models\SessionAvailability;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns sessions feed successfully', function () {

    $user = User::factory()->create();
    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $session->id,
        'scheduled_at' => now()->addDay(),
        'ends_at' => now()->addDay()->addHour(),
        'status' => 'open',
    ]);

    $response = $this->actingAs($user)
        ->getJson('api/v1/sessions');

    $response->assertOk()
        ->assertJsonStructure([
            'message',
            'data' => [
                'recommended' => [
                    '*' => [
                        'slug',
                        'title',
                        'description',
                        'availabilities',
                    ]
                ],
                'sessions' => [
                    'data' => [
                        '*' => [
                            'slug',
                            'title',
                            'description',
                            'availabilities',
                        ]
                    ],
                    'pagination' => [
                        'current_page',
                        'last_page',
                        'per_page',
                        'total',
                    ],
                ],
            ]
        ]);
});

it('returns mentor sessions by username with availabilities and pagination', function () {

    $mentor = User::factory()->mentor()->create([
        'username' => 'mentor-test',
    ]);

    $sessions = MentorSession::factory()
        ->count(3)
        ->create([
            'user_id' => $mentor->id,
        ]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $sessions[0]->id,
        'scheduled_at' => now()->addDays(2),
    ]);

    SessionAvailability::factory()->create([
        'mentor_session_id' => $sessions[0]->id,
        'scheduled_at' => now()->subDays(2),
    ]);

    $response = $this->getJson("/api/v1/sessions/mentor-test");

    $response->assertOk()
        ->assertJsonStructure([
            'message',
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
                            'availabilities',
                            'availabilities_count',
                        ]
                    ],
                    'links',
                    'meta',
        ]);
});
