<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    require __DIR__.'/api/auth.php';
    require __DIR__.'/api/student/major.php';
    require __DIR__.'/api/student/category.php';
    require __DIR__.'/api/student/university.php';
    require __DIR__.'/api/mentor/profile.php';
    require __DIR__.'/api/mentor/session.php';
    require __DIR__.'/api/mentor/session_availability.php';
    require __DIR__.'/api/admin/major.php';
    require __DIR__.'/api/admin/university.php';
    require __DIR__.'/api/admin/faq.php';
    require __DIR__.'/api/admin/user.php';
    require __DIR__.'/api/student/mentor.php';
    require __DIR__.'/api/student/quiz.php';
});
