<?php

use App\Http\Controllers\Api\V1\Student\UniversityController;
use Illuminate\Support\Facades\Route;

Route::prefix('universities')
    ->controller(UniversityController::class)
    ->group(function (): void {
        Route::get('/', 'index')->name('api.v1.universities.index');
        Route::get('/{university:slug}', 'show');
    });
