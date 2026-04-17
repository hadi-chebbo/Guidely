<?php

namespace Database\Seeders;

use App\Models\HiringCompany;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HiringCompanySeeder extends Seeder
{
    public function run(): void
    {
        $majorIds = DB::table('majors')->pluck('id');

        if ($majorIds->isEmpty()) {
            return;
        }

        foreach ($majorIds as $majorId) {
            HiringCompany::factory()
                ->count(fake()->numberBetween(2, 4))
                ->create(['major_id' => $majorId]);
        }
    }
}
