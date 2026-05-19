<?php

use App\Http\Controllers\Api\V1\Admin\MentorController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/mentor-applications/')
    ->controller(MentorController::class)
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function () {
        Route::get('/{user:username}','show');
    });
