<?php

namespace Database\Factories;

use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UniversityFactory extends Factory
{
    protected $model = University::class;

    public function definition(): array
    {
        $cities = [
            'Beirut',
            'Tripoli',
            'Sidon',
            'Tyre',
            'Byblos',
            'Jounieh',
            'Zahle',
            'Nabatieh',
            'Baalbek',
            'Aley',
        ];

        $city = fake()->randomElement($cities);
        $nameEn = fake()->randomElement([
            'National',
            'American',
            'International',
            'Modern',
            'Mediterranean',
            'Levant',
            'Cedar',
            'Coastal',
        ]).' University of '.$city;

        return [
            'name_en' => $nameEn,
            'name_ar' => fake()->boolean(40) ? null : fake()->randomElement([
                'Jamiat Beirut',
                'Jamiat Lubnan',
                'Jamiat Al Sharq',
                'Jamiat Al Bahr',
            ]),
            'slug' => Str::slug($nameEn.'-'.fake()->unique()->numberBetween(100, 99999)),
            'type' => fake()->randomElement(['public', 'private']),
            'location' => $city,
            'website' => fake()->boolean(85) ? 'https://www.'.Str::slug(str_replace(' University', '', $nameEn)).'.edu.lb' : null,
            'logo_url' => fake()->boolean(60) ? fake()->imageUrl(400, 400, 'education') : null,
            'description_en' => fake()->boolean(80) ? fake()->paragraph(3) : null,
            'description_ar' => fake()->boolean(35) ? fake()->sentence(18) : null,
            'founded_year' => fake()->numberBetween(1866, 2022),
            'accreditation' => fake()->boolean(75) ? fake()->randomElement([
                'Lebanese Ministry of Education',
                'NECHE',
                'ABET',
                'AACSB',
                'Middle States',
            ]) : null,
        ];
    }
}
