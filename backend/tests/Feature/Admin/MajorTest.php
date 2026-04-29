<?php

use App\Models\Major;
use App\Models\Category;
use App\Models\User;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
});

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

test('can get majors', function () {

    $category = Category::factory()->create();

    Major::factory()->count(25)->create([
        'category_id' => $category->id,
    ]);


    $response = $this->getJson('api/v1/admin/majors');

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'data',
        'links',
        'meta'
    ]);

    $this->assertCount(20, $response->json('data'));
});

test('can create major', function () {

    $category = Category::factory()->create();
    $skills = Skill::factory()->count(3)->create();

    $payload = [
        'name_en'              => 'Computer Science',
        'name_ar'              => 'علم الحاسوب',
        'slug'                 => 'computer-science',
        'overview'             => 'This is an overview of Computer Science.',
        'description'          => 'This is a description of Computer Science.',
        'duration_years'       => 4,
        'difficulty_level'     => 'hard',
        'salary_min'           => 1000,
        'salary_max'           => 5000,
        'local_demand'         => 'high',
        'international_demand' => 'high',
        'category_id'          => $category->id,
        'skills'               => $skills->pluck('id')->toArray(),
    ];

    $response = $this->postJson('api/v1/admin/majors', $payload);

    $response->assertStatus(201);

    $response->assertJsonStructure([
        'data' => [
            'id',
            'name_en',
        ]
    ]);

    $this->assertDatabaseHas('majors', [
        'name_en'     => 'Computer Science',
        'slug'        => 'computer-science',
        'category_id' => $category->id,
    ]);

    foreach ($skills as $skill) {
        $this->assertDatabaseHas('major_skill', [
            'major_id' => $response->json('data.id'),
            'skill_id' => $skill->id,
        ]);
    }
});

test('cannot create major without required fields', function () {
    $response = $this->postJson('api/v1/admin/majors', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'name_en',
        'name_ar',
        'slug',
        'overview',
        'description',
        'duration_years',
        'difficulty_level',
        'salary_min',
        'salary_max',
        'local_demand',
        'international_demand',
        'category_id',
        'skills',
    ]);
});

test('can show single major' , function() {
    $category = Category::factory()->create();

    $major = Major::factory()->create([
                'category_id'=> $category->id,
                'name_en' => 'Computer Science',
                'slug' => 'computer-science',
            ]);

    $response = $this->getJson("api/v1/admin/majors/{$major->id}");

    $response->assertStatus(200);

    $response->assertJson([
        'message' => 'Major Fetched Successfully',
        'data' => [
            'id' => $major->id,
            'name_en' => 'Computer Science',
            'slug' => 'computer-science',
        ]
    ]);

    $response->assertJsonStructure([
        'message',
        'data' => [
            'id',
            'name_en',
            'name_ar',
            'slug',
            'overview',
            'description',
            'duration_year',
            'difficulty_level',
            'salary_min',
            'salary_max',
            'local_demand',
            'international_demand',
            'is_featured',
            'cover_image',
        ],
    ]);

});