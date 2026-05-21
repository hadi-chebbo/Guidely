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
                    ->withCount('availabilities')
                    ->with([
                        'mentor',
                        'availabilities' => function ($q) {
                            $q->where('scheduled_at', '>=', now())
                                ->orderBy('scheduled_at');
                        }
                    ])
                    ->latest()
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
            ->withCount('availabilities')
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
                'sessions' => [
                    'data' => SessionResource::collection($sessions->items()),
                    'pagination' => [
                        'current_page' => $sessions->currentPage(),
                        'last_page' => $sessions->lastPage(),
                        'per_page' => $sessions->perPage(),
                        'total' => $sessions->total(),
                    ]
                ],
            ],
            'Sessions Retrieved Successfully',
            200
        );
    }
}
