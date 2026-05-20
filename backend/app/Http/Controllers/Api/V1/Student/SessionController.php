<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\SessionResource;
use App\Models\MentorSession;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    use ApiResponseTrait;
    public function index(Request $request)
    {
        $user = $request->user();

        $recommended = collect();
        $recommendedIds = [];

        if ($user) {

            $quizResult = $user->quizResults()
                ->latest()
                ->first();

            if ($quizResult) {

                $topCategories = collect($quizResult->category_scores)
                    ->sortByDesc(fn($score) => $score)
                    ->take(2)
                    ->keys();

                $topSkills = collect($quizResult->skill_scores)
                    ->sortByDesc(fn($score) => $score)
                    ->take(2)
                    ->keys();

                $recommended = MentorSession::query()
                    ->whereHas('mentor')
                    ->whereHas('availabilities', function ($q) {
                        $q->where('scheduled_at', '>=', now());
                    })
                    ->where(function ($query) use ($topCategories, $topSkills) {

                        // assuming mentor_sessions table contains:
                        // - category column
                        // - skill column

                        $query->whereIn('category', $topCategories)
                            ->orWhereIn('skill', $topSkills);
                    })
                    ->with([
                        'mentor',
                        'availabilities' => function ($q) {
                            $q->where('scheduled_at', '>=', now())
                                ->orderBy('scheduled_at');
                        }
                    ])
                    ->limit(6)
                    ->get();

                $recommendedIds = $recommended->pluck('id')->toArray();
            }
        }


        $sessions = MentorSession::query()
            ->whereHas('mentor')
            ->whereNotIn('id', $recommendedIds)
            ->whereHas('availabilities', function ($q) {
                $q->where('scheduled_at', '>=', now());
            })
            ->with([
                'mentor',
                'availabilities' => function ($q) {
                    $q->where('scheduled_at', '>=', now())
                        ->orderBy('scheduled_at');
                }
            ])
            ->latest()
            ->paginate(10);

 
        return $this->success(
            [
                'recommended' => SessionResource::collection($recommended),
                'sessions' => SessionResource::collection($sessions),
            ],
            'Sessions Retrieved Successfully',
            200
        );
    }
}
