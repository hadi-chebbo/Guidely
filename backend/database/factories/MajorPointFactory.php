<?php

namespace Database\Factories;

use App\Models\MajorPoint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MajorPoint>
 */
class MajorPointFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'type' => $this->faker->randomElement(['pro', 'con']),
            'content' => $this->faker->sentence(12), 
        ];
    }
}
