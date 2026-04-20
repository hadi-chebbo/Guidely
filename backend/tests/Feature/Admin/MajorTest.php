<?php

use App\Models\Major;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

test('can get majors', function () {

    $user = User::factory()->create();
    
    Sanctum::actingAs($user);

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
