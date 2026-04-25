<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUniversityTableResource;
use App\Models\University;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UniversityController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
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

        return AdminUniversityTableResource::collection($universities);
    }
}
