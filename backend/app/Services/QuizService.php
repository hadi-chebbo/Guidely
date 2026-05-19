<?php

namespace App\Services;

use App\Models\Major;
use App\Models\QuestionOption;
use Illuminate\Support\Facades\Auth;

class QuizService
{
    public function submit(array $data)
    {
        // Step 1 — fetch all submitted options with their weights
        $options = QuestionOption::with('question')
            ->whereIn('id', $data['answers'])
            ->get();

        // Step 2 — separate by section and calculate scores
        $categoryScores = [];
        $skillScores    = [];

        foreach ($options as $option) {
            if ($option->question->section === 'interest') {
                foreach ($option->weights as $categoryId => $score) {
                    $categoryScores[$categoryId] = ($categoryScores[$categoryId] ?? 0) + $score;
                }
            } else {
                foreach ($option->weights as $skillId => $score) {
                    $skillScores[$skillId] = ($skillScores[$skillId] ?? 0) + $score;
                }
            }
        }

        // Step 3 — get top 3 categories
        arsort($categoryScores);
        $topCategoryIds = array_slice(array_keys($categoryScores), 0, 3);

        // Step 4 — get candidate majors from top categories, eager load their skills
        $candidateMajors = Major::whereIn('category_id', $topCategoryIds)
            ->with('skills')
            ->get();

        // Step 5 — identify skills the user is strong in (score >= 3)
        $strongSkillIds = array_keys(array_filter($skillScores, fn($score) => $score >= 3));

        // Step 6 — calculate match percentage for each candidate major
        $recommendations = $candidateMajors->map(function ($major) use ($strongSkillIds) {
            $requiredSkillIds = $major->skills->pluck('id')->toArray();

            $matchPercentage = empty($requiredSkillIds)
                ? 50
                : round((count(array_intersect($strongSkillIds, $requiredSkillIds)) / count($requiredSkillIds)) * 100);

            return [
                'major_id' => $major->id,
                'en_major_name' => $major->name_en,
                'ar_major_name' => $major->name_ar,
                '_sort'      => $matchPercentage,
            ];
        })
            ->sortByDesc('_sort')
            ->take(5)
            ->values()
            ->map(fn($item) => [
                'major_name' => $item['en_major_name'],
                'الاختصاص' => $item['ar_major_name']
            ]);

        // Step 7 — save the result
        $result = Auth::user()->quizResults()->create([
            'answers'         => $data['answers'],
            'category_scores' => $categoryScores,
            'skill_scores'    => $skillScores,
            'recommendations' => $recommendations->toArray(),
            'taken_at'        => now(),
        ]);

        return [
            'recommendations' => $recommendations,
            'quiz_result'     => $result,
        ];
    }
}
