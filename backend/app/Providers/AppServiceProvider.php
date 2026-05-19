<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        RateLimiter::for('login', function ($request) {

            $key = strtolower($request->email) . '|' . $request->ip();

            $attempts = RateLimiter::attempts($key);

            if ($attempts > 10) {
                return Limit::perMinute(1)
                    ->by($key)
                    ->response(function () {
                        return response()->json([
                            'message' => 'Too many login attempts. You are temporarily locked for 1 hour.',
                        ], 429);
                    });
            }

            if ($attempts > 5) {
                return Limit::perMinute(2)
                    ->by($key)
                    ->response(function () {
                        return response()->json([
                            'message' => 'Too many attempts. Please slow down.',
                        ], 429);
                    });
            }

            return Limit::perMinute(5)
                ->by($key)
                ->response(function () {
                    return response()->json([
                        'message' => 'Too many requests. Please try again shortly.',
                    ], 429);
                });
        });

        RateLimiter::for('register', function (Request $request) {

            $key = strtolower($request->input('email')) . '|' . $request->ip();

            return Limit::perMinute(5)->by($key);
        });

        RateLimiter::for('forgot-password', function (Request $request) {

            $key = strtolower($request->input('email')) . '|' . $request->ip();

            return Limit::perMinutes(10, 3)->by($key);
        });

        RateLimiter::for('reset-password', function (Request $request) {

            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('email-resend', function (Request $request) {

            $key = 'resend:' . ($request->user()?->id ?? $request->ip());

            $attempts = Cache::get($key . ':attempts', 0);
            $blockedUntil = Cache::get($key . ':blocked_until');

            if ($blockedUntil && now()->lt($blockedUntil)) {
                return Limit::none()->response(function () use ($blockedUntil) {
                    return response()->json([
                        'message' => 'Too many email resend attempts. Try again after ' . $blockedUntil->diffForHumans(),
                    ], 429);
                });
            }

            return Limit::perMinute(3)->by($key);
        });

        RateLimiter::for('admin-read', function ($request) {
            return Limit::perMinute(80)->by($request->user()->id);
        });

        RateLimiter::for('admin-write', function ($request) {
            return Limit::perMinute(15)->by($request->user()->id);
        });
    }
}
