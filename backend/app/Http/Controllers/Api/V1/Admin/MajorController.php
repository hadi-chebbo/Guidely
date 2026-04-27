<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Major;
use App\Http\Resources\MajorResource;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\Admin\Major\StoreMajorRequest;

class MajorController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $majors = Major::latest()->paginate(20);

        return $this->success(MajorResource::collection($majors), "Majors Fetched Successfully", 200);

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
}
