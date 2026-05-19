<?php

namespace Database\Seeders;

use App\Models\SessionAvailability;
use App\Models\User;
use App\Models\UserReservation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $availabilities = SessionAvailability::all();

        $availabilities->each(function ($availability) use ($users) {
            UserReservation::factory()
                ->count(1)
                ->create([
                    'user_id' => $users->random()->id,
                    'session_availability_id' => $availability->id,
                ]);
        });
    }
}
