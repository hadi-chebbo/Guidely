<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\MajorController;

Route::prefix('admin/majors')
    ->controller(MajorController::class)
    ->middleware(['auth:sanctum','role:admin'])
    ->group(function (): void {
        Route::get('/', 'index')->middleware('throtle:admin-read');
        Route::post('/', 'store')->middleware('throtle:admin-write');
        Route::get('/{major}','show')->middleware('throtle:admin-read');
});