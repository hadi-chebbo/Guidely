<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.                                        *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'avatar_url' => $this->faker->imageUrl(200, 200, 'people', true),
            'phone' => $this->faker->phoneNumber(),
            'school' => $this->faker->company(),
            'grade' => $this->faker->randomElement(['10', '11', '12']),
            'preferred_language' => $this->faker->randomElement(['en', 'ar', 'fr']),
            'is_premium' => $this->faker->boolean(20),

            'premium_expires_at' => function (array $attributes) {
                return $attributes['is_premium']
                    ? now()->addMonths(rand(1, 6))
                    : null;
            },

            'onboarding_data' => [
                    'step' => $this->faker->numberBetween(1, 5),
                    'completed' => $this->faker->boolean(),
                ],
            'remember_token' => Str::random(10),
        ];
        
    }

    public function student(): static
    {
        return $this->state([
            'role' => 'student',
        ]);
    }

    public function admin(): static
    {
        return $this->state([
            'role' => 'admin',
            'password' => static::$password ??= Hash::make('admin123'),
        ]);
    }

    public function mentor(): static
    {
        return $this->state([
            'role' => 'mentor',
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
