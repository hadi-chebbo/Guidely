<?php

use App\Http\Controllers\Api\V1\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/users')
        ->controller(UserController::class)
        ->middleware(['auth:sanctum', 'role:admin'])
        ->group(function (): void {
                Route::middleware('throttle:admin-read')->group(function () {
                    Route::get('/','index');
                    Route::get('/search','search');
                });
                Route::middleware('throttle:admin-write')->group(function () {
                    Route::patch('/{user}/toggleBlock','toggleBlock');
                });

        });

