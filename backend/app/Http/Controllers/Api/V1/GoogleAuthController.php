<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Resources\Admin\UserResource;

class GoogleAuthController extends Controller
{
    use ApiResponseTrait;

    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try{
            $googleUser = Socialite::driver('google')->stateless()->user();
        }catch (Exception $e){
            return redirect($this->frontendUrl('/login?error=google_auth_failed'));
        }

        $user = User::where('google_id', $googleUser->getId())
                    ->orWhere('email', $googleUser->getEmail())
                    ->first();
        
        if($user){
            $updates = [];
            if (!$user->google_id) {
                $updates['google_id'] = $googleUser->getId();
            }
            $updates['avatar_url'] = $googleUser->getAvatar();
            $user->update($updates);
        }
        else {
            $user = User::create([
                'name'              => $googleUser->getName(),
                'username'          => $this->generateUsername($googleUser->getName()),
                'email'             => $googleUser->getEmail(),
                'google_id'         => $googleUser->getId(),
                'avatar_url'        => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'password'          => bcrypt(Str::random(24)),
            ]);
        }

        if ($user->is_blocked) {
            return redirect($this->frontendUrl('/login?error=blocked'));
        }

        $token = $user->createToken('google-auth')->plainTextToken;

        return redirect($this->frontendUrl('/auth/google/callback?token=' . $token));

    }

    private function frontendUrl(string $path): string
    {
        $base = rtrim(config('app.frontend_url'), '/');
        
        return $base . $path;
    }

    private function generateUsername(string $name): string
    {
        // "John Doe" → "johndoe", then check uniqueness
        $base     = strtolower(preg_replace('/\s+/', '', $name));
        $username = $base;
        $counter  = 1;

        while (User::where('username', $username)->exists()) {
            $username = $base . $counter++;
        }

        return $username;
    }
}
