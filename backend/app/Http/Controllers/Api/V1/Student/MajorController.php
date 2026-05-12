<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\MajorResource;
use App\Models\Major;
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

    public function toggleFavorite(Request $request, Major $major): JsonResponse
    {
        $user = $request->user();

        $isFavorite = $user->favoriteMajors()
            ->whereKey($major->id)
            ->exists();

        if ($isFavorite) {
            $user->favoriteMajors()->detach($major->id);

            return $this->success(
                ['is_favorite' => false],
                'Major removed from favorites',
                200
            );
        }

        $user->favoriteMajors()->attach($major->id);

        return $this->success(
            ['is_favorite' => true],
            'Major added to favorites',
            200
        );
    }
}
