<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUniversityTableResource;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UniversityController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Forbidden.');
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

        return AdminUniversityTableResource::collection($universities);
    }
}
