<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Student\ReservationController;

Route::prefix('reservations')
    ->controller(ReservationController::class)
    ->middleware(['auth:sanctum','role:student'])
    ->group(function (): void {
        Route::patch('/{reservation}/cancel','cancel');
        Route::get('/','index');
    });