<?php

use App\Http\Controllers\Api\V1\Stripe\StripeWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('stripe')->group(function (): void {
    Route::post('/webhook', [StripeWebhookController::class, 'handle']);
})



?>