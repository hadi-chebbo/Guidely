<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Student\TestController;

Route::prefix('test')
    ->controller(TestController::class)
    ->middleware(['auth:sanctum','role:student'])
    ->group(function (): void {
        Route::get('/questions','getQuestions');
        Route::post('/submit','submit');
    });