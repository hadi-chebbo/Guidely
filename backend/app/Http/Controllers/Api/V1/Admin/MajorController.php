<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Major;
use App\Http\Resources\MajorResource;
use App\Http\Resources\FaqResource;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\Admin\Major\StoreMajorRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

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

        $major = DB::transaction(function () use ($validated, $skills) {
            $major = Major::create($validated);

            if (! empty($skills)) {
                $major->skills()->sync($skills);
            }

            return $major;
        });

        return $this->success(
            new MajorResource($major->load(['category', 'skills'])),
            "Major Created Successfully",
            201
        );
    }

    public function show(Major $major)
    {
        return $this->success(new MajorResource($major),"Major Fetched Successfully",200);
    }

   public function faqs(Major $major): JsonResponse
    {
        $faqs = $major->faqs()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return $this->success(
            FaqResource::collection($faqs),
            'Major FAQs Fetched Successfully',
            200
        );
    }
}
