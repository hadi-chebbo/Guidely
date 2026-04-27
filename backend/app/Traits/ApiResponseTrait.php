<?php

namespace App\Traits;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\JsonResponse;

trait ApiResponseTrait
{
    //
     protected function success($data = null, string $message = '', int $status = 200): JsonResponse
    {
        if ($data instanceof AnonymousResourceCollection) {
            return $data->additional(['message' => $message])
                        ->response()
                        ->setStatusCode($status);
        }

        return response()->json([
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    protected function error(string $message = '', int $status = 400): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data'    => null,
        ], $status);
    }
}
