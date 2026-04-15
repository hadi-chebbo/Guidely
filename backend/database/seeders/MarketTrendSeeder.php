<?php

namespace Database\Seeders;

use App\Models\MarketTrend;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarketTrendSeeder extends Seeder
{
    public function run(): void
    {
        if (!DB::getSchemaBuilder()->hasTable('majors')) {
            return;
        }

        $majorIds = DB::table('majors')->pluck('id');

        if ($majorIds->isEmpty()) {
            return;
        }

        $currentYear = (int) date('Y');
        $sectors = [
            'Information Technology',
            'Banking and Finance',
            'Healthcare',
            'Education',
            'Telecommunications',
            'Logistics',
            'Construction',
            'Media',
            'Energy',
            'Public Sector',
        ];
        $sources = [
            'Lebanese Labor Market Survey',
            'Ministry of Labor Report',
            'Central Administration of Statistics',
            'Private Sector Hiring Study',
        ];

        foreach ($majorIds as $majorId) {
            for ($year = $currentYear - 3; $year <= $currentYear; $year++) {
                MarketTrend::query()->updateOrCreate(
                    ['major_id' => $majorId, 'year' => $year],
                    [
                        'demand_score' => fake()->numberBetween(1, 100),
                        'avg_starting_salary_usd' => fake()->numberBetween(3000, 30000),
                        'employment_rate' => fake()->randomFloat(2, 40, 99.5),
                        'top_sectors' => collect($sectors)->shuffle()->take(fake()->numberBetween(2, 4))->values()->all(),
                        'source' => fake()->randomElement($sources),
                    ]
                );
            }
        }
    }
}
