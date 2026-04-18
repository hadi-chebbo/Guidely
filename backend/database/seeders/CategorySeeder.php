<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $categories = [
            [
                'name_en' => 'Engineering',
                'name_ar' => 'الهندسة',
                'slug' => 'engineering',
                'description' => 'Technical and scientific disciplines.',
            ],
            [
                'name_en' => 'Business',
                'name_ar' => 'الأعمال',
                'slug' => 'business',
                'description' => 'Management, finance, and marketing fields.',
            ],
            [
                'name_en' => 'Medicine',
                'name_ar' => 'الطب',
                'slug' => 'medicine',
                'description' => 'Healthcare and medical sciences.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
