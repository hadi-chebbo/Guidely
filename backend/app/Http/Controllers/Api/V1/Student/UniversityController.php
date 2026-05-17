<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\CompareUniversitiesRequest;
use App\Http\Requests\Student\IndexUniversityRequest;
use App\Http\Resources\Student\UniversityResource;
use App\Models\University;
use App\Services\UniversityComparisonService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class UniversityController extends Controller
{
    use ApiResponseTrait;

    public function index(IndexUniversityRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $universities = University::query()
            ->select([
                'name_en',
                'name_ar',
                'slug',
                'type',
                'location',
                'website',
                'logo_url',
                'description_en',
                'description_ar',
                'founded_year',
            ])
            ->when(
                $request->filled('search'),
                fn($query) => $query->where(function ($searchQuery) use ($filters) {
                    $searchQuery
                        ->where('name_en', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('name_ar', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('location', 'like', '%' . $filters['search'] . '%');
                })
            )
            ->when(
                $request->filled('type'),
                fn($query) => $query->where('type', $filters['type'])
            )
            ->when(
                $request->filled('location'),
                fn($query) => $query->where('location', $filters['location'])
            )
            ->orderBy('name_en')
            ->orderBy('slug')
            ->paginate($perPage)
            ->withQueryString();

        return $this->success(
            UniversityResource::collection($universities),
            'Universities retrieved successfully',
            200
        );
    }

    public function show(University $university)
    {
        $university->load('majors');

        return $this->success(new UniversityResource($university),"University Fetched Successfully", 200);
    }
    public function __construct(
        private UniversityComparisonService $comparisonService
    ) {}

    public function compare(
        CompareUniversitiesRequest $request
    ): JsonResponse {
        $slugs = $request->input('universities');

        $result = $this->comparisonService->compare(
            $slugs[0],
            $slugs[1]
        );

        return $this->success(
            $result,
            'Universities Compared Successfully',
            200
        );
    }
}
