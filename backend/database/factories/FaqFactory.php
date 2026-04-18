<?php

namespace Database\Factories;

use App\Models\Faq;
use App\Models\Major;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
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
            'major_id' => Major::inRandomOrder()->first()->id ?? Major::factory(),
            'question' => $this->faker->sentence() . '?',
            'answer' => $this->faker->paragraph(),
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}
