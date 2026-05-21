<?php

namespace Database\Factories;

use App\Models\SessionAvailability;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<SessionAvailability>
 */
class SessionAvailabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $start = fake()->dateTimeBetween('+1 days', '+1 month');

        return [
            'uuid' => Str::uuid(),
            'scheduled_at' => $start,
            'status' => fake()->randomElement(['open', 'full', 'cancelled', 'completed']),
            'meeting_platform' => fake()->randomElement(['zoom', 'google_meet', 'teams']),
            'meeting_link'     => fake()->url(),
        ];
    }
}
