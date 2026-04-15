<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Seeder;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'name_en' => 'American University of Beirut',
                'name_ar' => null,
                'slug' => 'american-university-of-beirut',
                'type' => 'private',
                'location' => 'Beirut',
                'website' => 'https://www.aub.edu.lb',
                'logo_url' => null,
                'description_en' => 'Private research university in Beirut.',
                'description_ar' => null,
                'founded_year' => 1866,
                'accreditation' => 'NECHE',
            ],
            [
                'name_en' => 'Lebanese University',
                'name_ar' => null,
                'slug' => 'lebanese-university',
                'type' => 'public',
                'location' => 'Beirut',
                'website' => 'https://www.ul.edu.lb',
                'logo_url' => null,
                'description_en' => 'National public university with campuses across Lebanon.',
                'description_ar' => null,
                'founded_year' => 1951,
                'accreditation' => 'Lebanese Ministry of Education',
            ],
            [
                'name_en' => 'Saint Joseph University of Beirut',
                'name_ar' => null,
                'slug' => 'saint-joseph-university-of-beirut',
                'type' => 'private',
                'location' => 'Beirut',
                'website' => 'https://www.usj.edu.lb',
                'logo_url' => null,
                'description_en' => 'Francophone private university in Beirut.',
                'description_ar' => null,
                'founded_year' => 1875,
                'accreditation' => 'Middle States',
            ],
            [
                'name_en' => 'Beirut Arab University',
                'name_ar' => null,
                'slug' => 'beirut-arab-university',
                'type' => 'private',
                'location' => 'Beirut',
                'website' => 'https://www.bau.edu.lb',
                'logo_url' => null,
                'description_en' => 'Private university with multiple campuses in Lebanon.',
                'description_ar' => null,
                'founded_year' => 1960,
                'accreditation' => 'Lebanese Ministry of Education',
            ],
            [
                'name_en' => 'Lebanese American University',
                'name_ar' => null,
                'slug' => 'lebanese-american-university',
                'type' => 'private',
                'location' => 'Byblos',
                'website' => 'https://www.lau.edu.lb',
                'logo_url' => null,
                'description_en' => 'Private university with Beirut and Byblos campuses.',
                'description_ar' => null,
                'founded_year' => 1924,
                'accreditation' => 'NECHE',
            ],
            [
                'name_en' => 'University of Balamand',
                'name_ar' => null,
                'slug' => 'university-of-balamand',
                'type' => 'private',
                'location' => 'El Koura',
                'website' => 'https://www.balamand.edu.lb',
                'logo_url' => null,
                'description_en' => 'Private university in North Lebanon.',
                'description_ar' => null,
                'founded_year' => 1988,
                'accreditation' => 'Lebanese Ministry of Education',
            ],
            [
                'name_en' => 'Notre Dame University Louaize',
                'name_ar' => null,
                'slug' => 'notre-dame-university-louaize',
                'type' => 'private',
                'location' => 'Zouk Mosbeh',
                'website' => 'https://www.ndu.edu.lb',
                'logo_url' => null,
                'description_en' => 'Private Catholic university in Keserwan.',
                'description_ar' => null,
                'founded_year' => 1987,
                'accreditation' => 'NECHE',
            ],
            [
                'name_en' => 'Holy Spirit University of Kaslik',
                'name_ar' => null,
                'slug' => 'holy-spirit-university-of-kaslik',
                'type' => 'private',
                'location' => 'Jounieh',
                'website' => 'https://www.usek.edu.lb',
                'logo_url' => null,
                'description_en' => 'Private university in Mount Lebanon.',
                'description_ar' => null,
                'founded_year' => 1938,
                'accreditation' => 'Lebanese Ministry of Education',
            ],
        ];

        foreach ($rows as &$row) {
            $row['created_at'] = now();
            $row['updated_at'] = now();
        }

        University::query()->upsert(
            $rows,
            ['slug'],
            [
                'name_en',
                'name_ar',
                'type',
                'location',
                'website',
                'logo_url',
                'description_en',
                'description_ar',
                'founded_year',
                'accreditation',
                'updated_at',
            ]
        );
    }
}
