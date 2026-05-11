<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\MajorResource;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MajorController extends Controller
{
    use ApiResponseTrait;

    public function favorites(Request $request): JsonResponse
    {
        $favorites = $request->user()
            ->favoriteMajors()
            ->latest('user_favorites.created_at')
            ->get();

        return $this->success(
            MajorResource::collection($favorites),
            'Favorite majors retrieved successfully',
            200
        );
    }
}
