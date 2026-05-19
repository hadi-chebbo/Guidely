<?php

use App\Http\Controllers\Api\V1\Student\MentorController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentors')
    ->controller(MentorController::class)
    ->group(function (): void {
        Route::get('/', 'index');

        Route::post('/apply', 'apply')
            ->middleware(['auth:sanctum', 'role:student']);

        Route::get('/{user:username}/available-sessions', 'availableSessions')
            ->name('api.v1.mentors.available-sessions.index');

        Route::get('/{user:username}', 'show');
    });
