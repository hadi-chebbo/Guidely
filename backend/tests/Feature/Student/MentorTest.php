<?php

use App\Models\Category;
use App\Models\Major;
use App\Models\User;
use App\Models\MentorProfile;
use App\Models\QuizResult;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns 404 when mentor does not exist', function () {

    $response = $this->getJson("/api/v1/mentors/invalid_user");

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

    $response = $this->getJson("/api/v1/mentors/pending_user");

    $response->assertNotFound();
});

it('returns mentors index with empty recommended when unauthenticated', function () {
    $major = Major::factory()->create();

    User::factory()->mentor()->count(3)->create()->each(function ($mentor) use ($major) {
        $mentor->mentorProfile()->create(
            MentorProfile::factory()->make(['major_id' => $major->id])->toArray()
        );
    });

    $response = $this->getJson('/api/v1/mentors');

    $response->assertOk()
        ->assertJsonCount(0, 'data.recommended')
        ->assertJsonStructure([
            'data' => [
                'recommended',
                'mentors' => ['*' => [
                    'name',
                    'username',
                    'avatar_url',
                    'school',
                    'preferred_language',
                    'profile',
                ]],
            ],
        ]);
});

it('filters mentors by search, major, and category', function () {
    $category = Category::factory()->create(['slug' => 'tech']);
    $major    = Major::factory()->create(['slug' => 'cs', 'category_id' => $category->id]);

    $mentor = User::factory()->mentor()->create(['name' => 'john Doe']);
    $mentor->mentorProfile()->create(
        MentorProfile::factory()->make(['major_id' => $major->id, 'status' => 'approved'])->toArray()
    );

    $other = User::factory()->mentor()->create();
    $other->mentorProfile()->create(
        MentorProfile::factory()->make(['major_id' => Major::factory()->create()->id, 'status' => 'approved'])->toArray()
    );

    $this->getJson('/api/v1/mentors?search=john')
        ->assertOk()->assertJsonCount(1, 'data.mentors');

    $this->getJson('/api/v1/mentors?major_slug=cs')
        ->assertOk()->assertJsonCount(1, 'data.mentors');

    $this->getJson('/api/v1/mentors?category_slug=tech')
        ->assertOk()->assertJsonCount(1, 'data.mentors');
});

it('returns recommended mentors based on top 2 quiz categories', function () {
    $categoryA = Category::factory()->create();
    $categoryB = Category::factory()->create();
    $categoryC = Category::factory()->create();

    $mentorA = User::factory()->create(['role' => 'mentor']);

    $mentorA->mentorProfile()->create(
        MentorProfile::factory()->make([
            'major_id' => Major::factory()->create([
                'category_id' => $categoryA->id,
            ])->id,
            'status' => 'approved',
        ])->toArray()
    );

    $mentorB = User::factory()->create(['role' => 'mentor']);

    $mentorB->mentorProfile()->create(
        MentorProfile::factory()->make([
            'major_id' => Major::factory()->create([
                'category_id' => $categoryB->id,
            ])->id,
            'status' => 'approved',
        ])->toArray()
    );

    $mentorC = User::factory()->create(['role' => 'mentor']);

    $mentorC->mentorProfile()->create(
        MentorProfile::factory()->make([
            'major_id' => Major::factory()->create([
                'category_id' => $categoryC->id,
            ])->id,
            'status' => 'approved',
        ])->toArray()
    );

    $user = User::factory()->create();

    QuizResult::factory()->create([
        'user_id' => $user->id,
        'category_scores' => [
            (string) $categoryA->id => 90,
            (string) $categoryB->id => 80,
            (string) $categoryC->id => 50,
        ],
    ]);

    $response = $this
        ->actingAs($user)
        ->getJson('/api/v1/mentors');

    $response
        ->assertOk()
        ->assertJsonCount(2, 'data.recommended');

    $usernames = collect($response->json('data.recommended'))
        ->pluck('username')
        ->toArray();

    expect($usernames)
        ->toContain($mentorA->username)
        ->toContain($mentorB->username)
        ->not->toContain($mentorC->username);
});