<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Major;
use App\Http\Resources\MajorResource;

class MajorController extends Controller
{
    public function index()
    {
        $majors = Major::latest()->paginate(20);

        return MajorResource::collection($majors);

    }
}
