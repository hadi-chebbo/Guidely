<?php

namespace App\Services;

use App\Models\University;
use Illuminate\Support\Collection;

class UniversityComparisonService
{
    public function compare(string $slugA, string $slugB): array
    {
        $universities = University::query()
            ->whereIn('slug', [$slugA, $slugB])
            ->with('majors')
            ->get()
            ->keyBy('slug');

        if ($universities->count() !== 2) {
            throw new \Exception('One or more universities not found.');
        }

        $uniA = $universities[$slugA];
        $uniB = $universities[$slugB];

        return [
            'university_a' => $this->formatUniversity($uniA),
            'university_b' => $this->formatUniversity($uniB),

            'comparison' => [
                'basic_info' => [
                    'name' => [
                        'a' => $uniA->name_en,
                        'b' => $uniB->name_en,
                    ],
                    'type' => [
                        'a' => $uniA->type,
                        'b' => $uniB->type,
                    ],
                    'location' => [
                        'a' => $uniA->location,
                        'b' => $uniB->location,
                    ],
                    'founded_year' => [
                        'a' => $uniA->founded_year,
                        'b' => $uniB->founded_year,
                    ],
                    'accreditation' => [
                        'a' => $uniA->accreditation,
                        'b' => $uniB->accreditation,
                    ],
                ],

                'majors' => [
                    'a' => $this->formatMajors($uniA),
                    'b' => $this->formatMajors($uniB),
                ],
            ],
        ];
    }

    private function formatUniversity(University $university): array
    {
        return [
            'name_en' => $university->name_en,
            'name_ar' => $university->name_ar,
            'slug' => $university->slug,
            'type' => $university->type,
            'location' => $university->location,
            'website' => $university->website,
            'logo_url' => $university->logo_url,
            'description_en' => $university->description_en,
            'description_ar' => $university->description_ar,
            'founded_year' => $university->founded_year,
            'accreditation' => $university->accreditation,
        ];
    }

    private function formatMajors(University $university): array
    {
        return $university->majors->map(function ($major) {
            return [
                'slug' => $major->slug ?? null,
                'name' => $major->name ?? null,
                'credit_price_usd' => $major->pivot->credit_price_usd,
                'total_credits' => $major->pivot->total_credits,
                'admission_requirements' => $major->pivot->admission_requirements,
                'language_of_instruction' => $major->pivot->language_of_instruction,
                'has_scholarship' => (bool) $major->pivot->has_scholarship,
                'campus' => $major->pivot->campus,
            ];
        })->values()->toArray();
    }
}