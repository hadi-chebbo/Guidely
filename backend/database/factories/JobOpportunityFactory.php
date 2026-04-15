<?php

namespace Database\Factories;

use App\Models\JobOpportunity;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobOpportunityFactory extends Factory
{
    protected $model = JobOpportunity::class;

    public function definition(): array
    {
        return [
            'major_id' => 1,
            'title_en' => fake()->randomElement([
                'Software Engineer',
                'Data Analyst',
                'Project Coordinator',
                'Marketing Specialist',
                'Operations Analyst',
                'Research Assistant',
                'Business Development Associate',
                'Quality Assurance Engineer',
                'Supply Chain Analyst',
                'UX Researcher',
            ]),
            'title_ar' => null,
            'description_en' => fake()->boolean(80) ? fake()->paragraph(2) : null,
            'avg_salary_usd' => fake()->numberBetween(5000, 60000),
            'scope' => fake()->randomElement(['local', 'international', 'both']),
            'demand_level' => fake()->randomElement(['low', 'medium', 'high']),
        ];
    }
}
