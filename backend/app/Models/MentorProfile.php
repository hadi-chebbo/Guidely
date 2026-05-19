<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'major_id',
    'status',
    'is_accepting_students',
    'bio',
    'years_experience',
    'degree',
    'university_name',
    'graduation_year',
    'languages',
    'linkedin_url',
    'website_url',
])]
class MentorProfile extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'major_id' => 'integer',
            'is_accepting_students' => 'boolean',
            'years_experience' => 'integer',
            'graduation_year' => 'integer',
            'languages' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
