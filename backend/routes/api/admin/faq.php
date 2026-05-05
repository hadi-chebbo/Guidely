<?php

use App\Http\Controllers\Api\V1\Admin\FaqController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/majors/{major}/faqs')
    ->controller(FaqController::class)
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function (): void {
        Route::get('/', 'index')->name('api.v1.admin.majors.faqs.index');
        Route::post('/', 'store')->name('api.v1.admin.majors.faqs.store');
    });

Route::prefix('admin/faqs')
    ->controller(FaqController::class)
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function (): void {
        Route::put('/{faq}', 'update')->name('api.v1.admin.faqs.update');
        Route::delete('/{faq}', 'destroy')->name('api.v1.admin.faqs.destroy');
    });