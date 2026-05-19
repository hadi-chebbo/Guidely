<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(20)->student()->create();

        $mentors = User::factory()->count(10)->mentor()->create();
        $majorIds = Major::query()->pluck('id');

        $mentors->each(function (User $mentor) use ($majorIds): void {
            $attributes = [
                'status' => 'approved',
                'is_accepting_students' => true,
            ];

            if ($majorIds->isNotEmpty()) {
                $attributes['major_id'] = $majorIds->random();
            }

            MentorProfile::factory()->for($mentor)->create($attributes);
        });

        User::factory()->admin()->create([
            'name' => 'admin1',
            'email' => 'admin1@guidely.com'
        ]);
    }
}
