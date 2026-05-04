<?php

use App\Models\Major;
use App\Models\Category;
use App\Models\User;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $admin = User::factory()->admin()->create();
    Sanctum::actingAs($admin);
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


    $response = $this->getJson('/api/v1/admin/majors');

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'data',
        'links',
        'meta'
    ]);

    $this->assertCount(15, $response->json('data'));
});

test('can filter majors by single attribute', function () {
    $category = Category::factory()->create();

    Major::factory()->create([
        'category_id' => $category->id,
        'name_en'     => 'Computer Science',
    ]);

    Major::factory()->create([
        'category_id' => $category->id,
        'name_en'     => 'Business Administration',
    ]);

    $response = $this->getJson('api/v1/admin/majors?name_en=computer');

    $response->assertStatus(200);
    $this->assertCount(1, $response->json('data'));
    $this->assertEquals('Computer Science', $response->json('data.0.name_en'));
});

test('can filter majors by multiple attributes', function () {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();

    Major::factory()->create([
        'category_id'      => $category1->id,
        'name_en'          => 'Computer Science',
        'difficulty_level' => 'hard',
    ]);

    Major::factory()->create([
        'category_id'      => $category1->id,
        'name_en'          => 'Computer Engineering',
        'difficulty_level' => 'medium',
    ]);

    Major::factory()->create([
        'category_id'      => $category2->id,
        'name_en'          => 'Computer Networks',
        'difficulty_level' => 'hard',
    ]);

    $response = $this->getJson("api/v1/admin/majors?name_en=computer&category_id={$category1->id}&difficulty_level=hard");

    $response->assertStatus(200);
    $this->assertCount(1, $response->json('data'));
    $this->assertEquals('Computer Science', $response->json('data.0.name_en'));
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

    $response = $this->postJson('/api/v1/admin/majors', $payload);

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
    $response = $this->postJson('/api/v1/admin/majors', []);

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

    $response = $this->getJson("/api/v1/admin/majors/{$major->id}");

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