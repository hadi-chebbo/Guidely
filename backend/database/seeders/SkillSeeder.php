<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
         $skills = [
            ['name' => 'Critical Thinking', 'type' => 'soft', 'icon' => null],
            ['name' => 'Problem Solving', 'type' => 'soft', 'icon' => null],
            ['name' => 'Communication', 'type' => 'soft', 'icon' => null],
            ['name' => 'Programming', 'type' => 'hard', 'icon' => null],
            ['name' => 'Data Analysis', 'type' => 'hard', 'icon' => null],
            ['name' => 'Networking', 'type' => 'hard', 'icon' => null],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
