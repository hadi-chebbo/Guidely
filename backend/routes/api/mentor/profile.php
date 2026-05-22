<?php

use App\Http\Controllers\Api\V1\Mentor\MentorController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/profile')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->controller(MentorController::class)
    ->group(function (): void {
        Route::patch('/', 'update')->name('api.v1.mentor.profile.update');
        Route::get('/', 'show');
    });
