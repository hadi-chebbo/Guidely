<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\University\IndexUniversityRequest;
use App\Http\Resources\AdminUniversityTableResource;
use App\Models\University;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class UniversityController extends Controller
{
    use ApiResponseTrait;

    public function index(IndexUniversityRequest $request): JsonResponse
    {
        $filters = $request->validated();

        $universities = University::query()
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where('name_en', 'like', '%'.$filters['search'].'%')
            )
            ->when(
                $request->filled('type'),
                fn ($query) => $query->where('type', $filters['type'])
            )
            ->when(
                $request->filled('location'),
                fn ($query) => $query->where('location', $filters['location'])
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return $this->success(
            AdminUniversityTableResource::collection($universities),
            'Universities retrieved successfully',
            200,
        );
    }
}
