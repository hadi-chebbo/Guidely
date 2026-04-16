<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = \App\Models\Major::all();
        $skills = \App\Models\Skill::all();

        foreach ($majors as $major) {
            $major->skills()->attach(
                $skills->random(3)->pluck('id')->toArray()
            );
        }
    }
}
