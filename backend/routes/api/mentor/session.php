<?php

use App\Http\Controllers\Api\V1\Mentor\AvailabilityController;
use App\Http\Controllers\Api\V1\Mentor\SessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/sessions')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->group(function (): void {
        Route::get('/', [SessionController::class, 'index'])->name('api.v1.mentor.sessions.index');
        Route::get('/{session}/availabilities', [AvailabilityController::class, 'index'])
            ->whereNumber('session')
            ->name('api.v1.mentor.sessions.availabilities.index');
    });
