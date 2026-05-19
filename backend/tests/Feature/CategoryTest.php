<?php

use App\Models\Category;
use App\Models\User;
use App\Models\Major;
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

it('returns majors for a specific category' , function () {
    
    $category = Category::factory()->create();
    Major::factory(15)->for($category)->create();

    $response = $this->getJson("/api/v1/categories/{$category->slug}/majors");

    $response
        ->assertOk()
        ->assertJsonCount(15,'data')
        ->assertJsonStructure([
                'data' => [
                    '*' => [
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
                        'is_featured',
                        'cover_image',
                        'category' => [
                            'name_en',
                            'name_ar',
                            'slug',
                        ],
                        'skills' => [
                            '*' => [
                                'name',
                            ]
                        ],
                    ]
                ],
                'links' => [
                    'first',
                    'last',
                    'prev',
                    'next',
                ],
                'meta' => [
                    'current_page',
                    'from',
                    'last_page',
                    'links' => [
                        '*' => [
                            'url',
                            'label',
                            'page',
                            'active',
                        ]
                    ],
                    'path',
                    'per_page',
                    'to',
                    'total',
                ],
                'message',
            ]);
});