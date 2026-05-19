<?php

use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('authenticated student can get test questions', function () {

    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    $question = Question::create([
        'text_en' => 'What motivates you most?',
        'text_ar' => 'ما الذي يحفزك أكثر؟',
        'section' => 'interest',
        'order' => 1,
    ]);

    $question->options()->create([
        'text_en' => 'Solving problems',
        'text_ar' => 'حل المشاكل',
        'weights' => [
            1 => 5,
            3 => 2,
        ],
    ]);

    $question->options()->create([
        'text_en' => 'Helping people',
        'text_ar' => 'مساعدة الناس',
        'weights' => [
            2 => 4,
            1 => 1,
        ],
    ]);

    $response = $this->getJson('/api/v1/test/questions');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'text_en',
                    'text_ar',
                    'options'
                ]
            ],
            'message'
        ]);
});

it('fails validation when answers are missing', function () {

    $user = User::factory()->student()->create();

    Sanctum::actingAs($user, [], 'sanctum');

    $response = $this->postJson('/api/v1/test/submit', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['answers']);
});

it('submits quiz successfully', function () {

    $user = User::factory()->student()->create();

    Sanctum::actingAs($user);

    $question = Question::create([
        'text_en' => 'What do you enjoy?',
        'text_ar' => 'ماذا تحب؟',
        'section' => 'interest',
        'order' => 1,
    ]);

    $option = $question->options()->create([
        'text_en' => 'Programming',
        'text_ar' => 'البرمجة',
        'weights' => [1 => 5],
    ]);

    $response = $this->postJson('/api/v1/test/submit', [
        'answers' => [$option->id],
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Test Submitted Successfully',
        ])
        ->assertJsonStructure([
            'data' => ['recommendations'],
        ]);

    $this->assertDatabaseHas('quiz_results', [
        'user_id' => $user->id,
    ]);
});
