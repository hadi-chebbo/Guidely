<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\MajorController;

Route::prefix('admin/majors')
    ->controller(MajorController::class)
    ->middleware(['auth:sanctum','role:admin'])
    ->group(function (): void {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{major}/faqs', 'faqs')->name('api.v1.admin.majors.faqs');
        Route::get('/{major}','show');
});