<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
         Major::all()->each(function ($major) {
            Faq::factory()
                ->count(3) 
                ->create([
                    'major_id' => $major->id,
                ]);
        });
    }
}
