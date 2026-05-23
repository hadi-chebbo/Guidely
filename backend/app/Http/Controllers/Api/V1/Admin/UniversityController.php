<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\University\IndexUniversityRequest;
use App\Http\Requests\Admin\University\StoreUniversityRequest;
use App\Http\Requests\Admin\University\UniversityMajorRequest;
use App\Http\Requests\Admin\University\UpdateUniversityRequest;
use App\Http\Resources\Admin\MajorResource;
use App\Http\Resources\Admin\UniversityResource;
use App\Models\University;
use App\Models\UniversityMajor;
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
                fn($query) => $query->where(function ($searchQuery) use ($filters) {
                    $searchQuery
                        ->where('name_en', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('name_ar', 'like', '%' . $filters['search'] . '%');
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
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return $this->success(
            UniversityResource::collection($universities),
            'Universities retrieved successfully',
            200,
        );
    }

    public function store(StoreUniversityRequest $request): JsonResponse
    {
        $university = University::create($request->validated());

        return $this->success(
            new UniversityResource($university),
            'University Created Successfully',
            201,
        );
    }

    public function show(University $university): JsonResponse
    {
        return $this->success(
            new UniversityResource($university),
            'University Fetched Successfully',
            200,
        );
    }

    public function update(UpdateUniversityRequest $request, University $university): JsonResponse
    {
        $university->update($request->validated());

        return $this->success(
            new UniversityResource($university->fresh()),
            'University Updated Successfully',
            200,
        );
    }

    public function majors($id)
    {
        $university = University::findOrFail($id);

        $majors = $university->majors()->paginate(10);

        return $this->success(
            MajorResource::collection($majors),
            'University majors retrieved successfully',
            200
        );
    }

    public function storeMajor(
        UniversityMajorRequest $request,
        University $university
    ) {
        $validated = $request->validated();

        $pivotData = collect($validated)
            ->except('major_id')
            ->toArray();

        $university->majors()->attach(
            $validated['major_id'],
            $pivotData
        );

        $major = $university->majors()
            ->where('majors.id', $validated['major_id'])
            ->first();

        return $this->success(
            new MajorResource($major),
            'Major Assigned To University Successfully',
            201
        );
    }
}
