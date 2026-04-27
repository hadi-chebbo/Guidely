<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\MajorController;

Route::prefix('admin/majors')
    ->controller(MajorController::class)
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', 'index');
        Route::post('/', 'store');
});