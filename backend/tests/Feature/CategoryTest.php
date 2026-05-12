<?php

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns active categories for majors filter dropdown', function () {
    Category::factory()->create([
        'name_en' => 'Medicine',
        'name_ar' => 'Medicine AR',
        'slug' => 'medicine',
        'description' => 'Healthcare and medical sciences.',
        'icon' => 'stethoscope',
        'is_active' => true,
    ]);

    Category::factory()->create([
        'name_en' => 'Business',
        'name_ar' => 'Business AR',
        'slug' => 'business',
        'description' => 'Management, finance, and marketing fields.',
        'icon' => 'briefcase',
        'is_active' => false,
    ]);

    $response = $this->getJson('/api/v1/categories');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Categories retrieved successfully')
        ->assertJsonCount(1, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name_en',
                    'name_ar',
                    'slug',
                    'description',
                    'icon',
                    'created_at',
                    'updated_at',
                ],
            ],
            'message',
        ])
        ->assertJsonPath('data.0.name_en', 'Medicine')
        ->assertJsonMissingPath('data.0.is_active');
});
