<?php

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns public open future availability slots for an approved mentor', function () {
    $mentor = User::factory()->mentor()->create([
        'username' => 'rana-mentor',
    ]);

    MentorProfile::factory()->for($mentor)->for(Major::factory()->create())->create([
        'status' => 'approved',
    ]);

    $availableSession = $mentor->mentorSessions()->create([
        'title' => 'Application review',
        'description' => 'Review applications.',
        'type' => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity' => 1,
        'price' => 45,
        'currency' => 'USD',
        'is_active' => true,
    ]);

    $inactiveSession = $mentor->mentorSessions()->create([
        'title' => 'Inactive session',
        'description' => 'Inactive session.',
        'type' => 'group',
        'duration_minutes' => 90,
        'max_capacity' => 5,
        'price' => 20,
        'currency' => 'USD',
        'is_active' => false,
    ]);

    $availableSlot = $availableSession->availabilities()->create([
        'scheduled_at' => now()->addDay(),
        'ends_at' => now()->addDay()->addHour(),
        'status' => 'open',
        'timezone' => 'Asia/Beirut',
    ]);

    $fullSlot = $availableSession->availabilities()->create([
        'scheduled_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addHour(),
        'status' => 'full',
        'timezone' => 'Asia/Beirut',
    ]);

    $pastSlot = $availableSession->availabilities()->create([
        'scheduled_at' => now()->subDay(),
        'ends_at' => now()->subDay()->addHour(),
        'status' => 'open',
        'timezone' => 'Asia/Beirut',
    ]);

    $inactiveSlot = $inactiveSession->availabilities()->create([
        'scheduled_at' => now()->addDay(),
        'ends_at' => now()->addDay()->addHour(),
        'status' => 'open',
        'timezone' => 'Asia/Beirut',
    ]);

    $response = $this->getJson('/api/v1/mentors/rana-mentor/available-sessions');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Available mentor sessions retrieved successfully')
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.slug', $availableSession->slug)
        ->assertJsonPath('data.0.title', 'Application review')
        ->assertJsonPath('data.0.available_slots.0.uuid', $availableSlot->uuid)
        ->assertJsonPath('data.0.available_slots.0.timezone', 'Asia/Beirut')
        ->assertJsonMissingPath('data.0.id')
        ->assertJsonMissingPath('data.0.available_slots.0.id')
        ->assertJsonMissing(['uuid' => $fullSlot->uuid])
        ->assertJsonMissing(['uuid' => $pastSlot->uuid])
        ->assertJsonMissing(['uuid' => $inactiveSlot->uuid]);
});

it('returns an empty list when an approved mentor has no bookable slots', function () {
    $mentor = User::factory()->mentor()->create([
        'username' => 'empty-mentor',
    ]);

    MentorProfile::factory()->for($mentor)->for(Major::factory()->create())->create([
        'status' => 'approved',
    ]);

    $session = $mentor->mentorSessions()->create([
        'title' => 'Application review',
        'description' => 'Review applications.',
        'type' => 'one-on-one',
        'duration_minutes' => 60,
        'max_capacity' => 1,
        'price' => 45,
        'currency' => 'USD',
        'is_active' => true,
    ]);

    $session->availabilities()->create([
        'scheduled_at' => now()->addDay(),
        'ends_at' => now()->addDay()->addHour(),
        'status' => 'cancelled',
        'timezone' => 'Asia/Beirut',
    ]);

    $this->getJson('/api/v1/mentors/empty-mentor/available-sessions')
        ->assertOk()
        ->assertJsonPath('message', 'Available mentor sessions retrieved successfully')
        ->assertJsonCount(0, 'data');
});

it('returns not found when mentor is not approved', function () {
    $mentor = User::factory()->mentor()->create([
        'username' => 'pending-mentor',
    ]);

    MentorProfile::factory()->for($mentor)->for(Major::factory()->create())->create([
        'status' => 'pending',
    ]);

    $this->getJson('/api/v1/mentors/pending-mentor/available-sessions')
        ->assertNotFound()
        ->assertJsonPath('message', 'Mentor not found.');
});
