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
            'data' => [
                '*' => [
                    'slug',
                    'title',
                    'availabilities',
                ]
            ]
        ]);
});