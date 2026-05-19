<?php

namespace App\Services;

use App\Models\Major;
use Illuminate\Support\Collection;

class MajorComparisonService
{
    public function compareBySlugs(array $slugs): array
    {
        $majors = Major::with([
            'category',
            'skills',
            'points',
            'faqs',
            'jobOpportunities',
            'hiringCompanies',
            'universityMajors.university',
        ])
            ->whereIn('slug', $slugs)
            ->get()
            ->keyBy('slug');

        $a = $majors[$slugs[0]];
        $b = $majors[$slugs[1]];

        return [
            'comparison' => $this->buildSideBySide($a, $b),
            'analysis'   => $this->buildAnalysis($a, $b),
        ];
    }

    private function buildSideBySide($a, $b): array
    {
        return [
            'A' => $this->formatMajor($a),
            'B' => $this->formatMajor($b),
        ];
    }

    private function formatMajor($major): array
    {
        return [
            'slug'       => $major->slug,
            'name'       => $major->name_en,
            'difficulty' => $major->difficulty_level,
            'category'   => $major->category?->name_en,
            'salary_min' => $major->salary_min,
            'salary_max' => $major->salary_max,

            'skills' => $major->skills->pluck('name')->values(),

            'universities' => $major->universityMajors
                ->map(fn ($u) => $u->university?->name_en)
                ->filter()
                ->values(),
        ];
    }

    private function buildAnalysis($a, $b): array
    {
        $skillsA = $a->skills->pluck('name');
        $skillsB = $b->skills->pluck('name');

        $unisA = $a->universityMajors->map(fn ($u) => $u->university?->name_en)->filter();
        $unisB = $b->universityMajors->map(fn ($u) => $u->university?->name_en)->filter();

        return [
            'skills' => [
                'shared' => $skillsA->intersect($skillsB)->values(),
                'only_A' => $skillsA->diff($skillsB)->values(),
                'only_B' => $skillsB->diff($skillsA)->values(),
            ],

            'universities' => [
                'shared' => $unisA->intersect($unisB)->values(),
            ],

            'salary_range' => [
                'A' => [
                    'min' => $a->salary_min,
                    'max' => $a->salary_max,
                ],
                'B' => [
                    'min' => $b->salary_min,
                    'max' => $b->salary_max,
                ],
            ],

            'difficulty_level' => [
                'A' => $a->difficulty_level,
                'B' => $b->difficulty_level,
            ],
        ];
    }
}