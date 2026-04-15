<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UniversityMajor extends Model
{
    use HasFactory;

    protected $table = 'university_majors';

    protected $fillable = [
        'university_id',
        'major_id',
        'credit_price_usd',
        'total_credits',
        'admission_requirements',
        'language_of_instruction',
        'has_scholarship',
        'campus',
    ];

    protected $casts = [
        'credit_price_usd' => 'decimal:2',
        'total_credits' => 'integer',
        'has_scholarship' => 'boolean',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
