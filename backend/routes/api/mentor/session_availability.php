<?php

use App\Http\Controllers\Api\V1\Mentor\AvailabilityController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/sessions/{session:slug}/availabilities')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->controller(AvailabilityController::class)
    ->group(function (): void {
        Route::get('/', 'index')
            ->name('api.v1.mentor.sessions.availabilities.index');
        Route::patch('/{availability}', 'update');
        Route::delete('/{availability}', 'destroy');
        Route::post('/availabilities', 'store')->name('api.v1.mentor.sessionavailabilities.index');
    });
