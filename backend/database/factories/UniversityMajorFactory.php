<?php

namespace Database\Factories;

use App\Models\University;
use App\Models\UniversityMajor;
use Illuminate\Database\Eloquent\Factories\Factory;

class UniversityMajorFactory extends Factory
{
    protected $model = UniversityMajor::class;

    public function definition(): array
    {
        return [
            'university_id' => University::factory(),
            'major_id' => 1,
            'credit_price_usd' => fake()->randomFloat(2, 40, 650),
            'total_credits' => fake()->numberBetween(90, 170),
            'admission_requirements' => fake()->boolean(70) ? fake()->paragraph(2) : null,
            'language_of_instruction' => fake()->randomElement(['English', 'French', 'Arabic', 'Bilingual']),
            'has_scholarship' => fake()->boolean(45),
            'campus' => fake()->randomElement([
                'Beirut',
                'Tripoli',
                'Sidon',
                'Tyre',
                'Byblos',
                'Jounieh',
                'Zahle',
            ]),
        ];
    }
}
