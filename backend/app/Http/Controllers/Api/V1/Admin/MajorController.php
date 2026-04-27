<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Major;
use App\Http\Resources\MajorResource;
use App\Traits\ApiResponseTrait;

class MajorController extends Controller
{
    use ApiResponseTrait;
    
    public function index()
    {
        $majors = Major::latest()->paginate(20);

        return $this->success(MajorResource::collection($majors), "Majors Fetched Successfully", 200);

    }
}
