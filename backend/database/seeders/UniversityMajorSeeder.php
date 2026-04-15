<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversityMajorSeeder extends Seeder
{
    public function run(): void
    {
        if (!DB::getSchemaBuilder()->hasTable('majors')) {
            return;
        }

        $universityIds = University::query()->pluck('id');
        $majorIds = DB::table('majors')->pluck('id');

        if ($universityIds->isEmpty() || $majorIds->isEmpty()) {
            return;
        }

        $faker = fake();
        $rows = [];
        $languages = ['English', 'French', 'Arabic', 'Bilingual'];
        $campuses = ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Byblos', 'Jounieh', 'Zahle', 'Nabatieh'];

        foreach ($universityIds as $universityId) {
            $take = min($faker->numberBetween(3, 8), $majorIds->count());
            $selectedMajorIds = $majorIds->shuffle()->take($take);

            foreach ($selectedMajorIds as $majorId) {
                $rows[] = [
                    'university_id' => $universityId,
                    'major_id' => $majorId,
                    'credit_price_usd' => $faker->randomFloat(2, 40, 650),
                    'total_credits' => $faker->numberBetween(90, 170),
                    'admission_requirements' => $faker->boolean(75) ? $faker->paragraph(2) : null,
                    'language_of_instruction' => $faker->randomElement($languages),
                    'has_scholarship' => $faker->boolean(45),
                    'campus' => $faker->randomElement($campuses),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('university_majors')->upsert(
            $rows,
            ['university_id', 'major_id'],
            [
                'credit_price_usd',
                'total_credits',
                'admission_requirements',
                'language_of_instruction',
                'has_scholarship',
                'campus',
                'updated_at',
            ]
        );
    }
}
