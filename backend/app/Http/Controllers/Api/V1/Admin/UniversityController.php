<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUniversityTableResource;
use App\Models\University;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request): JsonResponse
    {
        if ($request->user()?->role !== 'admin') {
            return $this->error('Forbidden.', 403);
        }

        $universities = University::query()
            ->select([
                'id',
                'name_en',
                'slug',
                'type',
                'location',
                'created_at',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return $this->success(
            AdminUniversityTableResource::collection($universities),
            'Universities retrieved successfully',
        );
    }
}
