<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\UniversityController;

Route::prefix('admin/universities')
    ->controller(UniversityController::class)
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', 'index')->name('api.v1.admin.universities.index');
    });
