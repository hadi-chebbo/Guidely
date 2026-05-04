<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    require __DIR__.'/api/auth.php';
    require __DIR__.'/api/admin/major.php';
    require __DIR__.'/api/admin/university.php';
    require __DIR__.'/api/admin/faq.php';
});
