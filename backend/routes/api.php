<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    require __DIR__.'/api/auth.php';
    require __DIR__.'/api/admin.php';
});

Route::prefix('v1')->group(function (): void {
    require __DIR__.'/api/admin/major.php';
});
