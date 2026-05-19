<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\UniversityController;

Route::prefix('admin/universities')
        ->controller(UniversityController::class)
        ->middleware(['auth:sanctum', 'role:admin'])
        ->group(function (): void {
                //Read routes
                Route::middleware('throttle:admin-read')->group(function () {
                        Route::get('/', 'index')->name('api.v1.admin.universities.index');
                        Route::get('/{university}', 'show')->name('api.v1.admin.universities.show');
                        Route::get('/{university}/majors','majors');
                });

                //Write routes
                Route::middleware('throttle:admin-write')->group(function () {
                        Route::post('/', 'store')->name('api.v1.admin.universities.store');
                        Route::put('/{university}', 'update')->name('api.v1.admin.universities.update');
                });
});
