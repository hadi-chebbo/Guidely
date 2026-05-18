<?php

use App\Http\Controllers\Api\V1\Mentor\AvailabilityController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/sessions/{session:slug}')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->controller(AvailabilityController::class)
    ->group(function (): void {
        Route::get('/availabilities', 'index')
            ->name('api.v1.mentor.sessions.availabilities.index');
    });
