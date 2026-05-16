<?php

use App\Http\Controllers\Mentor\SessionAvailabilityController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/sessions')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->controller(SessionAvailabilityController::class)
    ->group(function (): void {
        Route::post('/{session}/availabilities','store')->name('api.v1.mentor.sessionavailabilities.index');
    });
