<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word();

        return [
            'name_en' => ucfirst($name),
            'name_ar' => 'تصنيف ' . $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence(10),
            'icon' => null,
            'is_active' => true,
        ];
    }
}
