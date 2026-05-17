<?php

use App\Models\Major;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns 404 when mentor does not exist', function () {

    $response = $this->getJson("/api/v1/student/mentors/invalid_user");

    $response->assertNotFound();
});

it('returns 404 when mentor is not approved', function () {

    $major = Major::factory()->create();

    $user = User::factory()->create([
        'username' => 'pending_user',
    ]);

    $user->mentorProfile()->create([
        'status' => 'pending',
        'major_id' => $major->id,
    ]);

    $response = $this->getJson("/api/v1/student/mentors/pending_user");

    $response->assertNotFound();
});