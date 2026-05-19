<?php

namespace Database\Seeders;

use App\Models\MentorSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class MentorSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mentors = User::factory()->mentor()->count(3)->create();

        foreach($mentors as $mentor){
            $mentor->mentorSessions()->createMany(
                MentorSession::factory()->count(5)->make()->toArray()
            );
        }

    }
}
