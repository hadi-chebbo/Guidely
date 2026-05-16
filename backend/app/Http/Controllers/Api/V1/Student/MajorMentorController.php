<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\IndexMajorMentorRequest;
use App\Http\Resources\Student\MajorMentorResource;
use App\Models\Major;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class MajorMentorController extends Controller
{
    use ApiResponseTrait;

    public function index(IndexMajorMentorRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $major = Major::query()
            ->select(['id', 'slug'])
            ->where('slug', $filters['major_slug'])
            ->first();

        $mentors = $major->mentorProfiles()
            ->select([
                'id',
                'user_id',
                'major_id',
                'is_accepting_students',
                'bio',
                'years_experience',
                'degree',
                'university_name',
                'graduation_year',
                'languages',
                'linkedin_url',
                'website_url',
                'updated_at',
            ])
            ->where('status', 'approved')
            ->with([
                'user:id,name,avatar_url',
                'user.mentorSessions' => fn ($query) => $query
                    ->select([
                        'id',
                        'user_id',
                        'duration_minutes',
                        'price',
                        'currency',
                        'is_active',
                    ])
                    ->where('is_active', true)
                    ->orderBy('price')
                    ->orderBy('id'),
            ])
            ->orderByDesc('is_accepting_students')
            ->latest('updated_at')
            ->paginate($perPage)
            ->withQueryString();

        return $this->success(
            MajorMentorResource::collection($mentors),
            'Major mentors retrieved successfully',
            200
        );
    }
}
