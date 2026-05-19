<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\MajorController;

Route::prefix('admin/majors')
    ->controller(MajorController::class)
    ->middleware(['auth:sanctum','role:admin'])
    ->group(function (): void {
       Route::middleware('throttle:admin-read')->group(function () {
            Route::get('/', 'index');
            Route::get('/{major}', 'show');
        });

        Route::middleware('throttle:admin-write')->group(function () {
            Route::post('/', 'store');
            Route::put('/{major}', 'update');
            Route::patch('/{major}/toggleFeatured','toggleFeatured');
        });
});