<?php

use App\Models\Major;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns paginated universities publicly with display fields', function () {
    University::factory()->create([
        'name_en' => 'Beta University',
        'slug' => 'beta-university',
        'type' => 'private',
        'location' => 'Tripoli',
    ]);

    University::factory()->create([
        'name_en' => 'Alpha University',
        'name_ar' => 'Alpha AR',
        'slug' => 'alpha-university',
        'type' => 'public',
        'location' => 'Beirut',
        'website' => 'https://alpha.example.com',
        'logo_url' => 'https://cdn.example.com/alpha-logo.png',
        'description_en' => 'Alpha description.',
        'description_ar' => 'Alpha Arabic description.',
        'founded_year' => 1900,
    ]);

    $response = $this->getJson('/api/v1/universities');

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Universities retrieved successfully')
        ->assertJsonPath('data.0.name_en', 'Alpha University')
        ->assertJsonPath('data.0.slug', 'alpha-university')
        ->assertJsonPath('data.0.type', 'public')
        ->assertJsonPath('data.0.location', 'Beirut')
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'name_en',
                    'name_ar',
                    'slug',
                    'type',
                    'location',
                    'website',
                    'logo_url',
                    'description_en',
                    'description_ar',
                    'founded_year',
                ],
            ],
            'links',
            'message',
            'meta',
        ])
        ->assertJsonMissingPath('data.0.id')
        ->assertJsonMissingPath('data.0.accreditation')
        ->assertJsonMissingPath('data.0.created_at')
        ->assertJsonMissingPath('data.0.updated_at');
});

it('supports public university search and filters', function () {
    University::factory()->create([
        'name_en' => 'American University of Beirut',
        'slug' => 'american-university-of-beirut',
        'type' => 'private',
        'location' => 'Beirut',
    ]);

    University::factory()->create([
        'name_en' => 'Lebanese University',
        'slug' => 'lebanese-university',
        'type' => 'public',
        'location' => 'Tripoli',
    ]);

    $response = $this->getJson('/api/v1/universities?search=American&type=private&location=Beirut&per_page=5');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name_en', 'American University of Beirut')
        ->assertJsonPath('data.0.type', 'private')
        ->assertJsonPath('data.0.location', 'Beirut')
        ->assertJsonPath('meta.per_page', 5)
        ->assertJsonPath('meta.total', 1);
});

it('validates public university filters', function () {
    $response = $this->getJson('/api/v1/universities?type=invalid&per_page=100');

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['type', 'per_page']);
});

it('returns a single university', function() {
    $university = University::factory()->create();
    $university->majors()->createMany(
        Major::factory()->count(5)->make()->toArray()
    );
    $response = $this->getJson("/api/v1/universities/{$university->slug}");
    $response
        ->assertOk()
        ->assertJsonCount(5, 'data.majors')
        ->assertJsonStructure([
                'data' => [
                'name_en',
                'name_ar',
                'slug',
                'type',
                'location',
                'website',
                'logo_url',
                'description_en',
                'description_ar',
                'founded_year',

                'majors' => [
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
                    ]
                ]
            ]
        ]);

});
//UniversityComparisonTest
it('compares two universities successfully', function () {

    $major1 = Major::factory()->create([
        'name_en' => 'Computer Science',
        'slug' => 'computer-science',
    ]);

    $major2 = Major::factory()->create([
        'name_en' => 'Business',
        'slug' => 'business',
    ]);

    $universityA = University::factory()->create([
        'name_en' => 'American University of Beirut',
        'slug' => 'aub',
        'location' => 'Beirut',
        'type' => 'private',
    ]);

    $universityB = University::factory()->create([
        'name_en' => 'Lebanese American University',
        'slug' => 'lau',
        'location' => 'Byblos',
        'type' => 'private',
    ]);

    // Common major
    $universityA->majors()->attach($major1->id, [
        'credit_price_usd' => 300,
        'total_credits' => 90,
        'admission_requirements' => 'SAT required',
        'language_of_instruction' => 'English',
        'has_scholarship' => true,
        'campus' => 'Beirut',
    ]);

    $universityB->majors()->attach($major1->id, [
        'credit_price_usd' => 250,
        'total_credits' => 95,
        'admission_requirements' => 'Entrance exam',
        'language_of_instruction' => 'English',
        'has_scholarship' => false,
        'campus' => 'Byblos',
    ]);

    // Unique major for LAU
    $universityB->majors()->attach($major2->id, [
        'credit_price_usd' => 200,
        'total_credits' => 80,
        'admission_requirements' => 'Interview',
        'language_of_instruction' => 'English',
        'has_scholarship' => true,
        'campus' => 'Byblos',
    ]);

    $response = $this->postJson('/api/v1/universities/compare', [
        'universities' => [
            'aub',
            'lau',
        ],
    ]);

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Universities Compared Successfully',
        ])
        ->assertJsonStructure([
            'data' => [
                'university_a' => [
                    'name_en',
                    'name_ar',
                    'slug',
                    'type',
                    'location',
                    'website',
                    'logo_url',
                    'description_en',
                    'description_ar',
                    'founded_year',
                    'accreditation',
                ],

                'university_b' => [
                    'name_en',
                    'name_ar',
                    'slug',
                    'type',
                    'location',
                    'website',
                    'logo_url',
                    'description_en',
                    'description_ar',
                    'founded_year',
                    'accreditation',
                ],

                'comparison' => [
                    'basic_info',

                    'common_majors' => [
                        '*' => [
                            'major' => [
                                'name',
                            ],

                            'university_a' => [
                                'credit_price_usd',
                                'total_credits',
                                'estimated_total_cost',
                                'language_of_instruction',
                                'has_scholarship',
                                'campus',
                            ],

                            'university_b' => [
                                'credit_price_usd',
                                'total_credits',
                                'estimated_total_cost',
                                'language_of_instruction',
                                'has_scholarship',
                                'campus',
                            ],

                            'comparison' => [
                                'credit_price_difference',
                                'cheaper_university',
                                'total_cost_difference',
                            ],
                        ],
                    ],

                    'unique_majors' => [
                        'university_a',
                        'university_b',
                    ],
                ],
            ],
        ]);
});

it('fails when less than two universities are provided', function () {

    $response = $this->postJson('/api/v1/universities/compare', [
        'universities' => [
            'aub',
        ],
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'universities',
        ]);
});
