<?php

use App\Http\Controllers\Api\V1\Mentor\AvailabilityController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/sessions/{session:slug}/availabilities')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->controller(AvailabilityController::class)
    ->group(function (): void {
        Route::get('/', 'index');
        Route::patch('/{availability}', 'update');
        Route::delete('/{availability}', 'destroy');
        Route::post('/', 'store');
    });
