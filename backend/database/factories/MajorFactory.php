<?php

namespace Database\Factories;

use App\Models\Major;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Major>
 */
class MajorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Major::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->jobTitle();

        return [
            'name_en' => $name,
            'name_ar' => 'تخصص ' . $name,
            'slug' => Str::slug($name),

            'overview' => $this->faker->paragraph(),
            'description' => $this->faker->paragraph(),


            'duration_years' => $this->faker->randomElement([3, 4, 5]),

            'difficulty_level' => $this->faker->randomElement([
                'easy', 'medium', 'hard', 'very_hard'
            ]),

            'salary_min' => $this->faker->numberBetween(500, 2000),
            'salary_max' => $this->faker->numberBetween(3000, 15000),

            'local_demand' => $this->faker->randomElement([
                'low', 'medium', 'high', 'very_high'
            ]),

            'international_demand' => $this->faker->randomElement([
                'low', 'medium', 'high', 'very_high'
            ]),

            'is_featured' => $this->faker->boolean(20), // 20% chance true

            'cover_image' => null,
        ];
    }
}
