<?php

use App\Http\Controllers\Api\V1\Student\CategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('categories')
    ->controller(CategoryController::class)
    ->group(function (): void {
        Route::get('/', 'index')->name('api.v1.categories.index');
    });
