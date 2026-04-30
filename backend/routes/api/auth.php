<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PasswordController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\EmailVerificationController;

Route::prefix('auth')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login'])->name('api.v1.auth.login');
    Route::post('/register', [AuthController::class, 'register'])->name('api.v1.auth.register');
    Route::post('/reset-password', [PasswordController::class, 'resetPassword'])->name('api.v1.auth.reset-password');
    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword'])->name('api.v1.auth.forgot-password');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return new UserResource($request->user());
        });
    });

Route::prefix('v1')->group(function () {
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->name('verification.verify');
    Route::post('/email/resend', [EmailVerificationController::class, 'resend'])
        ->name('verification.resend');
});

});
