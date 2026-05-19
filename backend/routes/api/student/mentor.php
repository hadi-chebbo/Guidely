<?php

use App\Http\Controllers\Api\V1\Student\MentorController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentors')
    ->controller(MentorController::class)
    ->group(function (): void {
        Route::get('/{user:username}', 'show');
        Route::get('/' , 'index');
        Route::post('/apply','apply');
    });

    
