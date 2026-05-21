<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Major;
use App\Http\Resources\Admin\MajorResource;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\Admin\Major\StoreMajorRequest;
use App\Http\Requests\Admin\Major\IndexMajorRequest;
use App\Http\Requests\Admin\Major\UpdateMajorRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class MajorController extends Controller
{
    use ApiResponseTrait;

    public function index(IndexMajorRequest $request)
    {
        $filters = $request->validated();

        $majors = Major::query()
            ->when(
                $request->filled('name_en'),
                fn($query) => $query->where('name_en', 'like', '%' . $filters['name_en'] . '%')
            )
            ->when(
                $request->filled('name_ar'),
                fn($query) => $query->where('name_ar', 'like', '%' . $filters['name_ar'] . '%')
            )
            ->when(
                $request->filled('category_id'),
                fn($query) => $query->where('category_id', $filters['category_id'])
            )
            ->when(
                $request->filled('duration_years'),
                fn($query) => $query->where('duration_years', $filters['duration_years'])
            )
            ->when(
                $request->filled('difficulty_level'),
                fn($query) => $query->where('difficulty_level', $filters['difficulty_level'])
            )
            ->when(
                $request->filled('salary_min'),
                fn($query) => $query->where('salary_min', '>=', $filters['salary_min'])
            )
            ->when(
                $request->filled('salary_max'),
                fn($query) => $query->where('salary_max', '<=', $filters['salary_max'])
            )
            ->when(
                $request->filled('local_demand'),
                fn($query) => $query->where('local_demand', $filters['local_demand'])
            )
            ->when(
                $request->filled('international_demand'),
                fn($query) => $query->where('international_demand', $filters['international_demand'])
            )
            ->when(
                $request->filled('is_featured'),
                fn($query) => $query->where('is_featured', $filters['is_featured'])
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return $this->success(
            MajorResource::collection($majors),
            'Majors retrieved successfully',
            200
        );
    }

    public function store(StoreMajorRequest $request)
    {
        $validated = $request->validated();

        $skills = $validated['skills'] ?? [];
        unset($validated['skills']);

        $major = Major::create($validated);

        if (!empty($skills)) {
            $major->skills()->sync($skills);
        }

        return $this->success(
            new MajorResource($major->load(['category', 'skills'])),
            "Major Created Successfully",
            201
        );
    }

    public function show(Major $major)
    {
        return $this->success(new MajorResource($major), "Major Fetched Successfully", 200);
    }

    public function update(UpdateMajorRequest $request, Major $major)
    {
        $validated = $request->validated();

        $skills = $validated['skills'] ?? [];
        unset($validated['skills']);

        $major->update($validated);

        if (! empty($skills)) {
            $major->skills()->sync($skills);
        }

        return $this->success(new MajorResource($major->load(['category', 'skills'])), "Major Updated Successfully", 200);
    }

    public function toggleFeatured(Major $major)
    {
        $major->update([
            'is_featured' => $major->is_featured ? false : true,
        ]);

        return $this->success(
            new MajorResource($major),
            $major->is_featured ? 'Major marked as featured' : 'Major marked as unfeatured',
            200
        );
    }
}
