<?php

namespace Database\Seeders;

<<<<<<< HEAD
=======
use App\Models\User;
>>>>>>> 24d49ea (first commit)
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
<<<<<<< HEAD
        $this->call([
            UserSeeder::class,
            UniversitySeeder::class,
            UniversityMajorSeeder::class,
            JobOpportunitySeeder::class,
            HiringCompanySeeder::class,
            MarketTrendSeeder::class,
        ]);

        $this->call([
            CategorySeeder::class,
            MajorSeeder::class,
            MajorPointSeeder::class,
            SkillSeeder::class,
            MajorSkillSeeder::class,
            FaqSeeder::class,
        ]);
    
=======
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
>>>>>>> 24d49ea (first commit)
    }
}
