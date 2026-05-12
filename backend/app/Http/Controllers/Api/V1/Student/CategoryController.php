<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    use ApiResponseTrait;

    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name_en')
            ->get();

        return $this->success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully',
            200
        );
    }
}
