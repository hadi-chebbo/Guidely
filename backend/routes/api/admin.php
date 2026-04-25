<?php

use App\Http\Controllers\Api\V1\Admin\UniversityController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function (): void {
        Route::get('/universities', [UniversityController::class, 'index'])
            ->name('api.v1.admin.universities.index');
    });
