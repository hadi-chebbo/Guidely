<?php

use App\Http\Controllers\Api\V1\Mentor\SessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('mentor/sessions')
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->controller(SessionController::class)
    ->group(function (): void {
        Route::get('/', 'index')->name('api.v1.mentor.sessions.index');
        Route::post('/','store')->name('api.v1.mentor.sessions.store');
        Route::put('/{session:slug}', 'update');
        Route::delete('/{session:slug}','destroy');
    });
