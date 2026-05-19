<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Override;

#[Fillable([
    'session_availability_id',
    'status',
])]

class UserReservation extends Model
{
    use HasFactory;

    #[Override]
    protected static function booted()
    {
        static::creating(function ($reservation) {
            $reservation->uuid = Str::uuid();
        });
    }
    
    #[Override]
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sessionAvailability()
    {
        return $this->belongsTo(SessionAvailability::class);
    }
}
