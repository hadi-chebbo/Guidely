<?php

use App\Http\Controllers\Api\V1\Student\ReservationController;
use Illuminate\Support\Facades\Route;

Route::prefix('user/reservations')
    ->middleware('auth:sanctum')
    ->controller(ReservationController::class)
    ->group(function (): void {
        Route::get('/', 'index')->name('api.v1.user.reservations.index');
    });
