<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUniversityTableResource;
use App\Models\University;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class UniversityController extends Controller
{
    use ApiResponseTrait;

    public function index(): JsonResponse
    {
        $universities = University::query()
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
