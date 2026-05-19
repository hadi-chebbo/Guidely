<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Faq\StoreFaqRequest;
use App\Http\Resources\Admin\FaqResource;
use App\Models\Major;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Admin\Faq\UpdateFaqRequest;
use App\Models\Faq;

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

    public function store(StoreFaqRequest $request, Major $major): JsonResponse
    {
        $faq = $major->faqs()->create($request->validated());

        return $this->success(
            new FaqResource($faq),
            'FAQ Created Successfully',
            201
        );
    }

    public function update(UpdateFaqRequest $request, Faq $faq): JsonResponse
{
    $faq->update($request->validated());

        return $this->success(
            new FaqResource($faq->fresh()),
            'FAQ Updated Successfully',
            200
        );
}
    public function destroy(Faq $faq): JsonResponse
    {
        $faq->delete();

        return $this->success(
            null,
            'FAQ Deleted Successfully',
            200
        );
    }
}