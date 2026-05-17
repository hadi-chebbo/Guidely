<?php

namespace Database\Factories;

use App\Models\MentorSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MentorSession>
 */
class MentorSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $type = fake()->randomElement(['one-on-one','group']);
        $title = fake()->sentence(4);

        return [
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'user_id' => User::factory()->mentor()->create(),
            'title' => $title,
            'description' => fake()->paragraph(),
            'type' => $type,
            'duration_minutes' => fake()->randomElement([30, 45, 60, 90, 120]),
            'max_capacity' => $type === 'one-on-one' ? 1 : fake()->numberBetween(5,30),
            'price' => fake()->randomFloat(2, 10, 200),
            'currency' => fake()->randomElement(['USD','EUR']),
            'is_active' => fake()->boolean(85),
        ];
    }
}
