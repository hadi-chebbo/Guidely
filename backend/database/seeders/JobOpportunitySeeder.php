<?php

namespace Database\Seeders;

use App\Models\JobOpportunity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobOpportunitySeeder extends Seeder
{
    public function run(): void
    {
        if (!DB::getSchemaBuilder()->hasTable('majors')) {
            return;
        }

        $majorIds = DB::table('majors')->pluck('id');

        if ($majorIds->isEmpty()) {
            return;
        }

        foreach ($majorIds as $majorId) {
            JobOpportunity::factory()
                ->count(fake()->numberBetween(2, 5))
                ->create(['major_id' => $majorId]);
        }
    }
}
