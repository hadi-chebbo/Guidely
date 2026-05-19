<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

#[Fillable([
    'slug',
    'title',
    'description',
    'type',
    'duration_minutes',
    'max_capacity',
    'price',
    'currency',
    'is_active'
])]
class MentorSession extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'max_capacity' => 'integer',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    #[Override]
    protected static function booted()
    {
        static::creating(function ($session) {
            $session->slug = Str::slug($session->title) . '-' . Str::random(6);
        });
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function availabilities()
    {
        return $this->hasMany(SessionAvailability::class);
    }
}
