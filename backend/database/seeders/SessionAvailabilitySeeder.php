<?php

namespace Database\Seeders;

use App\Models\MentorSession;
use App\Models\SessionAvailability;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SessionAvailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sessions = MentorSession::all();

        foreach($sessions as $session){
            $session->availabilities()->createMany(
                SessionAvailability::factory()->count(3)->make()->toArray()
            );
        }
    }
}
