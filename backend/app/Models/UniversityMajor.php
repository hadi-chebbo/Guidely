<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('university_majors')]
#[Fillable([
    'university_id',
    'major_id',
    'credit_price_usd',
    'total_credits',
    'admission_requirements',
    'language_of_instruction',
    'has_scholarship',
    'campus',
])]
class UniversityMajor extends Model
{
    use HasFactory;

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
