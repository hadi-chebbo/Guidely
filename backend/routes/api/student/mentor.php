<?php

use App\Http\Controllers\Api\V1\Student\MentorController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentors')
->middleware(['auth:sanctum','role:student'])
    ->controller(MentorController::class)
    ->group(function (): void {
        Route::get('/{user:username}', 'show');
        Route::post('/apply','apply');
    });
