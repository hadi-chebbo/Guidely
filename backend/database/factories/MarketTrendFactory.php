<?php

namespace Database\Factories;

use App\Models\MarketTrend;
use Illuminate\Database\Eloquent\Factories\Factory;

class MarketTrendFactory extends Factory
{
    protected $model = MarketTrend::class;

    public function definition(): array
    {
        $sectors = collect([
            'Information Technology',
            'Banking and Finance',
            'Healthcare',
            'Education',
            'Telecommunications',
            'Construction',
            'Manufacturing',
            'Media',
            'Logistics',
            'Energy',
        ])->shuffle()->take(fake()->numberBetween(2, 4))->values()->all();

        return [
            'major_id' => 1,
            'year' => fake()->numberBetween((int) date('Y') - 4, (int) date('Y')),
            'demand_score' => fake()->numberBetween(1, 100),
            'avg_starting_salary_usd' => fake()->numberBetween(3000, 30000),
            'employment_rate' => fake()->randomFloat(2, 40, 99.5),
            'top_sectors' => $sectors,
            'source' => fake()->randomElement([
                'Lebanese Labor Market Survey',
                'Ministry of Labor Report',
                'Central Administration of Statistics',
                'Private Sector Hiring Study',
            ]),
        ];
    }
}
