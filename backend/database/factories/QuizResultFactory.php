<?php

namespace Database\Factories;

use App\Models\QuizResult;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizResult>
 */
class QuizResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'answers'          => [1, 3, 5, 7, 9],
            'category_scores'  => ['1' => 17, '2' => 8, '3' => 5],
            'skill_scores'     => ['1' => 5, '2' => 3, '4' => 2],
        ];
    }
}
