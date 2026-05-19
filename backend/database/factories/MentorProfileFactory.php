<?php

namespace Database\Factories;

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorProfile>
 */
class MentorProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $languages = fake()->randomElements(
            ['English', 'Arabic', 'French'],
            fake()->numberBetween(1, 3)
        );

        return [
            'user_id' => User::factory()->state(['role' => 'mentor']),
            'major_id' => Major::factory(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'is_accepting_students' => fake()->boolean(80),
            'bio' => fake()->paragraph(3),
            'years_experience' => fake()->numberBetween(1, 20),
            'degree' => fake()->randomElement(['Bachelor', 'Master', 'PhD']),
            'university_name' => fake()->company().' University',
            'graduation_year' => fake()->numberBetween(2000, (int) date('Y')),
            'languages' => array_values($languages),
            'linkedin_url' => 'https://www.linkedin.com/in/'.fake()->userName(),
            'website_url' => fake()->url(),
        ];
    }
}
