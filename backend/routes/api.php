<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    require __DIR__.'/api/auth.php';
});
