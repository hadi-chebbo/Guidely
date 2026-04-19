<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\MajorPoint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $majors = Major::all();

        foreach ($majors as $major) {

            // 3 pros
            MajorPoint::factory()
                ->count(3)
                ->create([
                    'major_id' => $major->id,
                    'type' => 'pro',
                ]);

            // 3 cons
            MajorPoint::factory()
                ->count(3)
                ->create([
                    'major_id' => $major->id,
                    'type' => 'con',
                ]);
        }
    }
}
