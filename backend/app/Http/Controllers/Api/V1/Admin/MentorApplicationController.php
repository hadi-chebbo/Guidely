<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MentorApplication\IndexMentorApplicationRequest;
use App\Http\Resources\Admin\MentorApplicationResource;
use App\Models\MentorProfile;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class MentorApplicationController extends Controller
{
    use ApiResponseTrait;

    public function index(IndexMentorApplicationRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $applications = MentorProfile::query()
            ->where('status', 'pending')
            ->with(['user', 'major'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return $this->success(
            MentorApplicationResource::collection($applications),
            'Mentor applications retrieved successfully',
            200
        );
    }
}
