<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Override;

#[Fillable([
    'scheduled_at',
    'ends_at',
    'status',
    'timezone',
    'meeting_platform',
    'meeting_link'
])]

class SessionAvailability extends Model
{
    use HasFactory;
    
    protected $casts = [
        'scheduled_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    #[Override]
    protected static function booted()
    {
        static::creating(function ($availability) {
            $availability->uuid = Str::uuid();
        });
    }

    public function session()
    {
        return $this->belongsTo(MentorSession::class , 'mentor_session_id');
    }

    public function reservations()
    {
        return $this->hasMany(UserReservation::class);
    }

    #[Override]
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
