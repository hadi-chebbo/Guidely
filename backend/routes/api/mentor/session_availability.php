<?php

use App\Http\Controllers\Api\V1\Mentor\AvailabilityController;
use Illuminate\Support\Facades\Route;

Route::get('mentor/sessions/{session}/availabilities', [AvailabilityController::class, 'index'])
    ->middleware(['auth:sanctum', 'role:mentor'])
    ->whereNumber('session')
    ->name('api.v1.mentor.sessions.availabilities.index');
