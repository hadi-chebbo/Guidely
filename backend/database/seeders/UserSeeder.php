<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(20)->student()->create();

        User::factory()->count(10)->mentor()->create();

        User::factory()->admin()->create([
            'name' => 'admin1',
            'email' => 'admin1@guidely.com'
        ]);
    }
}
