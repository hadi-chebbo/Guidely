<?php

use App\Http\Controllers\Api\V1\Student\MajorController;
use App\Http\Controllers\Api\V1\Student\MajorMentorController;
use Illuminate\Support\Facades\Route;

Route::prefix('user/favorites')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [MajorController::class, 'favorites'])
            ->name('api.v1.user.favorites.index');
    });

Route::prefix('majors')
    ->group(function (): void {
        Route::get('/{major_slug}/mentors', [MajorMentorController::class, 'index'])
            ->name('api.v1.majors.mentors.index');
    });

Route::prefix('majors')
    ->middleware('auth:sanctum')
    ->controller(MajorController::class)
    ->group(function (): void {
        Route::patch('/{major}/favorite', 'toggleFavorite')
            ->name('api.v1.majors.favorite');
        Route::get('/{major:slug}/show','show')
            ->name('api.v1.majors.show');
        Route::get('/','index')
            ->name('api.v1.majors.index');
        Route::post('/compare', 'compare');
    });
