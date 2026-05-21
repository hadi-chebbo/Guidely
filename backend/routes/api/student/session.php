<?php

use App\Http\Controllers\Api\V1\Student\SessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('sessions')
    ->controller(SessionController::class)
    ->group(function (): void {
        Route::get('/' , 'index');
        Route::get('/{user:username}' , 'show');
    });

    
