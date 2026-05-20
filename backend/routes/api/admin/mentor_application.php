<?php

use App\Http\Controllers\Api\V1\Admin\MentorApplicationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/mentor-applications')
    ->controller(MentorApplicationController::class)
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function (): void {
        Route::middleware('throttle:admin-read')->group(function () {
            Route::get('/', 'index');
        });
    });
