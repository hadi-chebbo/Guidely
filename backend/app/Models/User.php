<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

#[Fillable(['google_id', 'name', 'username', 'email', 'password', 'avatar_url', 'phone', 'school', 'grade', 'preferred_language'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'onboarding_data' => 'array',
            'is_premium' => 'boolean',
            'is_blocked' => 'boolean',
        ];
    }

    public function quizResults()
    {
        return $this->hasMany(QuizResult::class);
    }

    public function favoriteMajors(): BelongsToMany
    {
        return $this->belongsToMany(Major::class, 'user_favorites')
            ->withTimestamps();
    }

    public function mentorProfile(): HasOne
    {
        return $this->hasOne(MentorProfile::class);
    }

    public function mentorSessions()
    {
        return $this->hasMany(MentorSession::class);
    }

    public function reservations()
    {
        return $this->hasMany(UserReservation::class);
    }
}
