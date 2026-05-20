<?php

use App\Models\MentorSession;
use App\Models\SessionAvailability;
use App\Models\User;
use App\Models\UserReservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to get user reservations', function () {
    $this->getJson('/api/v1/user/reservations')
        ->assertUnauthorized();
});

it('returns only the authenticated users reservations with session details', function () {
    $user = User::factory()->student()->create();
    $otherUser = User::factory()->student()->create();
    $mentor = User::factory()->mentor()->create([
        'name' => 'Mentor One',
        'username' => 'mentor-one',
    ]);

    $session = MentorSession::factory()->for($mentor, 'mentor')->create([
        'title' => 'Career planning',
        'description' => 'Plan your next career steps.',
        'type' => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity' => 1,
        'price' => 45,
        'currency' => 'USD',
    ]);

    $availability = SessionAvailability::factory()->for($session, 'session')->create([
        'scheduled_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(3)->addHour()->format('Y-m-d H:i:s'),
        'status' => 'full',
        'timezone' => 'Asia/Beirut',
    ]);

    $reservation = UserReservation::factory()
        ->for($user)
        ->for($availability, 'sessionAvailability')
        ->create(['status' => 'confirmed']);

    $otherAvailability = SessionAvailability::factory()->for($session, 'session')->create([
        'scheduled_at' => now()->addDays(4)->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(4)->addHour()->format('Y-m-d H:i:s'),
    ]);

    $otherReservation = UserReservation::factory()
        ->for($otherUser)
        ->for($otherAvailability, 'sessionAvailability')
        ->create();

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/user/reservations');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Reservations retrieved successfully')
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.uuid', (string) $reservation->uuid)
        ->assertJsonPath('data.0.status', 'confirmed')
        ->assertJsonPath('data.0.payment_status', null)
        ->assertJsonPath('data.0.mentor_session.title', 'Career planning')
        ->assertJsonPath('data.0.mentor_session.mentor.username', 'mentor-one')
        ->assertJsonPath('data.0.availability_slot.uuid', (string) $availability->uuid)
        ->assertJsonPath('data.0.availability_slot.timezone', 'Asia/Beirut')
        ->assertJsonMissing(['uuid' => (string) $otherReservation->uuid])
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'uuid',
                    'status',
                    'payment_status',
                    'mentor_session' => [
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
                    'availability_slot' => [
                        'uuid',
                        'scheduled_at',
                        'ends_at',
                        'status',
                        'timezone',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ],
            'links',
            'meta',
            'message',
        ]);
});

it('paginates user reservations', function () {
    $user = User::factory()->student()->create();
    $mentor = User::factory()->mentor()->create();
    $session = MentorSession::factory()->for($mentor, 'mentor')->create();

    $firstAvailability = SessionAvailability::factory()->for($session, 'session')->create([
        'scheduled_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(3)->addHour()->format('Y-m-d H:i:s'),
    ]);

    $secondAvailability = SessionAvailability::factory()->for($session, 'session')->create([
        'scheduled_at' => now()->addDays(4)->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(4)->addHour()->format('Y-m-d H:i:s'),
    ]);

    UserReservation::factory()
        ->for($user)
        ->for($firstAvailability, 'sessionAvailability')
        ->create(['created_at' => now()->subMinute()]);

    $latestReservation = UserReservation::factory()
        ->for($user)
        ->for($secondAvailability, 'sessionAvailability')
        ->create(['created_at' => now()]);

    Sanctum::actingAs($user);

    $this->getJson('/api/v1/user/reservations?per_page=1')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.uuid', (string) $latestReservation->uuid)
        ->assertJsonPath('meta.per_page', 1)
        ->assertJsonPath('meta.total', 2);
});
