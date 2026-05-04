<?php

use App\Models\Category;
use App\Models\Faq;
use App\Models\Major;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to get major faqs', function () {
    $category = Category::factory()->create();

    $major = Major::factory()->create([
        'category_id' => $category->id,
    ]);

    $this->getJson("/api/v1/admin/majors/{$major->id}/faqs")
        ->assertUnauthorized();
});

it('requires admin role to get major faqs', function () {
    $student = User::factory()->student()->create();

    Sanctum::actingAs($student);

    $category = Category::factory()->create();

    $major = Major::factory()->create([
        'category_id' => $category->id,
    ]);

    $this->getJson("/api/v1/admin/majors/{$major->id}/faqs")
        ->assertForbidden();
});

it('returns faqs for selected major only', function () {
    $admin = User::factory()->admin()->create();

    Sanctum::actingAs($admin);

    $category = Category::factory()->create();

    $major = Major::factory()->create([
        'category_id' => $category->id,
    ]);

    $otherMajor = Major::factory()->create([
        'category_id' => $category->id,
    ]);

    Faq::factory()->create([
        'major_id' => $major->id,
        'question' => 'First question',
        'answer' => 'First answer',
        'sort_order' => 1,
    ]);

    Faq::factory()->create([
        'major_id' => $major->id,
        'question' => 'Second question',
        'answer' => 'Second answer',
        'sort_order' => 2,
    ]);

    Faq::factory()->create([
        'major_id' => $otherMajor->id,
        'question' => 'Other major question',
        'answer' => 'Other major answer',
        'sort_order' => 1,
    ]);

    $response = $this->getJson("/api/v1/admin/majors/{$major->id}/faqs");

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Major FAQs Fetched Successfully')
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'major_id',
                    'question',
                    'answer',
                    'sort_order',
                    'created_at',
                    'updated_at',
                ],
            ],
            'message',
        ])
        ->assertJsonPath('data.0.question', 'First question')
        ->assertJsonPath('data.0.answer', 'First answer')
        ->assertJsonPath('data.1.question', 'Second question')
        ->assertJsonPath('data.1.answer', 'Second answer')
        ->assertJsonMissing([
            'question' => 'Other major question',
        ]);
});