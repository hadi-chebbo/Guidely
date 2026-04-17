<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class HiringCompanyFactory extends Factory
{
    public function definition(): array
    {
        $companyName = fake()->randomElement([
            'Murex',
            'Bank Audi',
            'Byblos Bank',
            'BLOM Bank',
            'Alfa Telecom',
            'Touch Lebanon',
            'Toters',
            'Anghami',
            'CME Offshore',
            'Deloitte Middle East',
            'PwC Middle East',
            'KPMG Levant',
            'Azadea Group',
            'Arope Insurance',
            'MEA',
        ]);

        return [
            'major_id' => 1,
            'company_name' => $companyName,
            'industry' => fake()->randomElement([
                'Technology',
                'Banking',
                'Telecommunications',
                'Consulting',
                'Retail',
                'Healthcare',
                'Education',
                'Media',
            ]),
            'location' => fake()->randomElement([
                'Beirut',
                'Tripoli',
                'Sidon',
                'Tyre',
                'Byblos',
                'Jounieh',
                'Zahle',
            ]),
            'logo_url' => fake()->boolean(55) ? fake()->imageUrl(400, 400, 'business') : null,
            'website_url' => fake()->boolean(80) ? 'https://www.'.Str::slug($companyName).'.com' : null,
            'is_local' => fake()->boolean(70),
        ];
    }
}
