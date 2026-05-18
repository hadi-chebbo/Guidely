<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\IndexMentorRequest;
use App\Http\Requests\Student\IndexMajorMentorRequest;
use App\Http\Resources\Student\PublicMentorResource;
use App\Models\Major;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class MentorController extends Controller
{

    use ApiResponseTrait;

    public function indexByMajor(IndexMajorMentorRequest $request, Major $major)
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $mentors = User::query()
            ->where('role', 'mentor')
            ->whereHas('mentorProfile', fn ($query) => $query
                ->where('status', 'approved')
                ->where('major_id', $major->id))
            ->with(['mentorProfile.major'])
            ->paginate($perPage)
            ->withQueryString();

        return $this->success(
            PublicMentorResource::collection($mentors),
            'Major mentors retrieved successfully',
            200
        );
    }

    public function show(User $user)
    {
        $user->load('mentorProfile');

        if (
            $user->role !== 'mentor' ||
            !$user->mentorProfile ||
            $user->mentorProfile->status !== 'approved'
        ) {
            return $this->error('Mentor not found.', 404);
        }

        return $this->success(
            new PublicMentorResource($user),
            'Mentor retrieved successfully',
            200
        );
    }

    public function index(IndexMentorRequest $request)
    {
        $filters = $request->validated();
        $perPage  = (int) ($filters['per_page'] ?? 15);

        $recommended = collect();
        $recommended_ids = [];
        $user = $request->user();

        if($user){
            $quizResult = $user->quizResults()->latest()->first();

            if($quizResult){
                $topCategoryIds = collect($quizResult->category_scores)
                    ->sortByDesc(fn ($score) => $score)
                    ->take(2)
                    ->keys();

                $recommended = User::query()
                ->where('role', 'mentor')
                ->whereHas('mentorProfile', fn ($q) => $q
                    ->where('status', 'approved')
                    ->whereHas('major', fn ($q) =>
                        $q->whereIn('category_id', $topCategoryIds)
                    )
                )
                ->with(['mentorProfile.major'])
                ->limit(6)
                ->get();

                $recommended_ids = $recommended->pluck('id')->toArray();
            }
        }

        $mentors = User::query()
        ->where('role', 'mentor')
        ->whereNotIN('id', $recommended_ids)
        ->whereHas('mentorProfile', fn ($q) => $q
            ->where('status', 'approved')
            ->when(
                isset($filters['major_slug']),
                fn ($q) => $q->whereHas('major', fn ($q) =>
                    $q->where('slug', $filters['major_slug'])
                )
            )
            ->when(
                isset($filters['category_slug']),
                fn ($q) => $q->whereHas('major.category', fn ($q) =>
                    $q->where('slug', $filters['category_slug'])
                )
            )
        )
        ->when(
            isset($filters['search']),
            fn ($q) => $q->where('name', 'like', "%{$filters['search']}%")
        )
        ->with(['mentorProfile.major'])
        ->paginate($perPage)
        ->withQueryString();

        return $this->success(
            [
                'recommended' => PublicMentorResource::collection($recommended),
                'mentors' => PublicMentorResource::collection($mentors)
            ],
            "Mentors Retreived Successfully",
            200
        );
    }
}
