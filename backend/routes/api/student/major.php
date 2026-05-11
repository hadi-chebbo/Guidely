<?php

use App\Http\Controllers\Api\V1\Student\MajorController;
use Illuminate\Support\Facades\Route;

Route::prefix('user/favorites')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [MajorController::class, 'favorites'])
            ->name('api.v1.user.favorites.index');
    });
