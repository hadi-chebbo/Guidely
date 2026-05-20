<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\IndexReservationRequest;
use App\Http\Resources\Student\UserReservationResource;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    use ApiResponseTrait;

    public function index(IndexReservationRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);

        $reservations = $request->user()
            ->reservations()
            ->with([
                'sessionAvailability.session.mentor',
            ])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return $this->success(
            UserReservationResource::collection($reservations),
            'Reservations retrieved successfully',
            200
        );
    }
}
