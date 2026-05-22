<?php

use App\Models\MentorSession;
use App\Models\SessionAvailability;
use App\Models\User;
use App\Models\UserReservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);
it('allows user to cancel their own reservation', function () {

    // 1. User
    $user = User::factory()->student()->create();

    // 2. Mentor
    $mentor = User::factory()->mentor()->create();

    // 3. Mentor session
    $mentorSession = \App\Models\MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    // 4. Availability (FIX: required FK)
    $availability = \App\Models\SessionAvailability::factory()->create([
        'mentor_session_id' => $mentorSession->id,
        'status' => 'full',
    ]);

    // 5. Reservation (FIX HERE WAS MISSING BEFORE)
    $reservation = UserReservation::factory()->create([
        'user_id' => $user->id,
        'session_availability_id' => $availability->id, // 🔥 REQUIRED FIX
        'status' => 'confirmed',
    ]);

    // 6. Auth
    Sanctum::actingAs($user);

    // 7. Call API
    $response = $this->patchJson("api/v1/reservations/{$reservation->uuid}/cancel");

    // 8. Assert
    $response->assertOk();

    expect($reservation->fresh()->status)->toBe('cancelled');
});

it('returns 404 for invalid reservation uuid', function () {

    $user = User::factory()->student()->create();

    Sanctum::actingAs($user);

    $response = $this->patchJson("api/v1/reservations/invalid-uuid/cancel");

    $response->assertNotFound();
});

it('updates reservation status to cancelled correctly', function () {

    $user = User::factory()->student()->create();
    $mentor = User::factory()->mentor()->create();

    $mentorSession = \App\Models\MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    $availability = \App\Models\SessionAvailability::factory()->create([
        'mentor_session_id' => $mentorSession->id,
    ]);

    $reservation = \App\Models\UserReservation::factory()->create([
        'user_id' => $user->id,
        'session_availability_id' => $availability->id,
        'status' => 'confirmed',
    ]);

    Sanctum::actingAs($user);

    $this->patchJson("api/v1/reservations/{$reservation->uuid}/cancel");

    expect($reservation->fresh()->status)->toBe('cancelled');
});

it('prevents cancelling an already cancelled reservation', function () {

    $user = User::factory()->student()->create();
    $mentor = User::factory()->mentor()->create();

    $mentorSession = \App\Models\MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    $availability = \App\Models\SessionAvailability::factory()->create([
        'mentor_session_id' => $mentorSession->id,
    ]);

    $reservation = \App\Models\UserReservation::factory()->create([
        'user_id' => $user->id,
        'session_availability_id' => $availability->id,
        'status' => 'cancelled',
    ]);

    Sanctum::actingAs($user);

    $response = $this->patchJson("api/v1/reservations/{$reservation->uuid}/cancel");

    $response->assertStatus(422);
});
it('prevents cancelling a completed reservation', function () {

    $user = User::factory()->student()->create();
    $mentor = User::factory()->mentor()->create();

    $mentorSession = \App\Models\MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    $availability = \App\Models\SessionAvailability::factory()->create([
        'mentor_session_id' => $mentorSession->id,
    ]);

    $reservation = \App\Models\UserReservation::factory()->create([
        'user_id' => $user->id,
        'session_availability_id' => $availability->id,
        'status' => 'completed',
    ]);

    Sanctum::actingAs($user);

    $response = $this->patchJson("api/v1/reservations/{$reservation->uuid}/cancel");

    $response->assertStatus(422);
});

it('returns authenticated student reservations with full structure', function () {

    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    // create mentor + session
    $mentor = User::factory()->mentor()->create();

    $session = MentorSession::factory()->create([
        'user_id' => $mentor->id,
    ]);

    // availability
    $availability = SessionAvailability::factory()->create([
        'mentor_session_id' => $session->id,
        'scheduled_at' => now()->addDays(5),
        'status' => 'open',
    ]);

    // reservation
    $reservation = UserReservation::factory()->create([
        'user_id' => $student->id,
        'session_availability_id' => $availability->id,
        'status' => 'confirmed',
    ]);

    $response = $this->getJson('/api/v1/reservations');

    $response->assertOk()
        ->assertJsonStructure([
            'message',
                'data' => [
                    '*' => [
                        'uuid',
                        'status',
                        'created_at',
                        'updated_at',
                        'availability' => [
                            'uuid',
                            'scheduled_at',
                            'ends_at',
                            'status',
                            'session' => [
                                'slug',
                                'title',
                                'description',
                                'type',
                                'duration_minutes',
                                'price',
                                'currency',
                                'mentor' => [
                                    'name',
                                    'username',
                                    'avatar_url',
                                ],
                            ],
                        ],
                    ],
                ],
                'links',
                'meta',
            ],
        );
});