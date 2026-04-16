<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            [
                'name_en' => 'Computer Science',
                'name_ar' => 'علوم الحاسوب',
                'overview' => 'Study of computers, algorithms, and software development.',
                'description' => 'Computer Science is a broad field that covers programming, algorithms, data structures, artificial intelligence, software engineering, and systems design. It prepares students to build modern applications and solve complex computational problems.',
                'duration_years' => 4,
                'difficulty_level' => 'hard',
                'salary_min' => 800,
                'salary_max' => 5000,
                'local_demand' => 'high',
                'international_demand' => 'very_high',
                'is_featured' => true,
            ],
            [
                'name_en' => 'Business Administration',
                'name_ar' => 'إدارة الأعمال',
                'overview' => 'Management of business operations and organizations.',
                'description' => 'Business Administration focuses on managing companies, improving organizational performance, marketing, finance, and strategic planning. It prepares students for leadership roles in different industries.',
                'duration_years' => 3,
                'difficulty_level' => 'medium',
                'salary_min' => 600,
                'salary_max' => 4000,
                'local_demand' => 'high',
                'international_demand' => 'high',
                'is_featured' => false,
            ],
            [
                'name_en' => 'Cyber Security',
                'name_ar' => 'الأمن السيبراني',
                'overview' => 'Protection of systems and networks from cyber attacks.',
                'description' => 'Cyber Security is the practice of protecting computers, networks, and data from unauthorized access, attacks, and damage. It includes ethical hacking, network security, and risk management.',
                'duration_years' => 4,
                'difficulty_level' => 'very_hard',
                'salary_min' => 1000,
                'salary_max' => 7000,
                'local_demand' => 'very_high',
                'international_demand' => 'very_high',
                'is_featured' => true,
            ],
        ];

        foreach ($majors as $major) {
            Major::create([
                'name_en' => $major['name_en'],
                'name_ar' => $major['name_ar'],
                'slug' => Str::slug($major['name_en']),
                'overview' => $major['overview'],
                'description' => $major['description'],
                'duration_years' => $major['duration_years'],
                'difficulty_level' => $major['difficulty_level'],
                'salary_min' => $major['salary_min'],
                'salary_max' => $major['salary_max'],
                'local_demand' => $major['local_demand'],
                'international_demand' => $major['international_demand'],
                'is_featured' => $major['is_featured'],
                'cover_image' => null,
            ]);
        }
    }
}
