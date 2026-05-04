<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Major;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    use ApiResponseTrait;

    public function index(Major $major): JsonResponse
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