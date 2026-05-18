<?php

namespace App\Services;

use App\Models\University;

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

                'common_majors' => $this->compareCommonMajors($uniA, $uniB),

                'unique_majors' => [
                    'university_a' => $this->uniqueMajors($uniA, $uniB),
                    'university_b' => $this->uniqueMajors($uniB, $uniA),
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

    private function compareCommonMajors(
        University $uniA,
        University $uniB
    ): array {
        $majorsA = $uniA->majors->keyBy('slug');
        $majorsB = $uniB->majors->keyBy('slug');

        $commonSlugs = $majorsA->keys()->intersect($majorsB->keys());

        return $commonSlugs->map(function ($slug) use ($majorsA, $majorsB, $uniA, $uniB) {

            $majorA = $majorsA[$slug];
            $majorB = $majorsB[$slug];

            $priceA = $majorA->pivot->credit_price_usd;
            $priceB = $majorB->pivot->credit_price_usd;

            $totalCostA = $priceA * $majorA->pivot->total_credits;
            $totalCostB = $priceB * $majorB->pivot->total_credits;

            return [
                'major' => [
                    'name' => $majorA->name_en,
                ],

                'university_a' => [
                    'credit_price_usd' => $priceA,
                    'total_credits' => $majorA->pivot->total_credits,
                    'estimated_total_cost' => round($totalCostA, 2),
                    'language_of_instruction' => $majorA->pivot->language_of_instruction,
                    'has_scholarship' => (bool) $majorA->pivot->has_scholarship,
                    'campus' => $majorA->pivot->campus,
                ],

                'university_b' => [
                    'credit_price_usd' => $priceB,
                    'total_credits' => $majorB->pivot->total_credits,
                    'estimated_total_cost' => round($totalCostB, 2),
                    'language_of_instruction' => $majorB->pivot->language_of_instruction,
                    'has_scholarship' => (bool) $majorB->pivot->has_scholarship,
                    'campus' => $majorB->pivot->campus,
                ],

                'comparison' => [
                    'credit_price_difference' => round(abs($priceA - $priceB), 2),
                    'cheaper_university' => match (true) {
                        $priceA < $priceB => $uniA->slug,
                        $priceB < $priceA => $uniB->slug,
                        default => null,
                    },

                    'total_cost_difference' => round(abs($totalCostA - $totalCostB), 2),
                ],
            ];
        })->values()->toArray();
    }

    private function uniqueMajors(
        University $sourceUniversity,
        University $comparisonUniversity
    ): array {
        $comparisonSlugs = $comparisonUniversity
            ->majors
            ->pluck('slug');

        return $sourceUniversity->majors
            ->filter(fn ($major) => ! $comparisonSlugs->contains($major->slug))
            ->map(function ($major) {
                return [
                    'name' => $major->name,
                    'slug' => $major->slug,
                    'credit_price_usd' => $major->pivot->credit_price_usd,
                    'total_credits' => $major->pivot->total_credits,
                ];
            })
            ->values()
            ->toArray();
    }
}