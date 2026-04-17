<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'major_id',
    'year',
    'demand_score',
    'avg_starting_salary_usd',
    'employment_rate',
    'top_sectors',
    'source',
])]
class MarketTrend extends Model
{
    use HasFactory;

    protected $casts = [
        'year' => 'integer',
        'demand_score' => 'integer',
        'avg_starting_salary_usd' => 'integer',
        'employment_rate' => 'decimal:2',
        'top_sectors' => 'array',
    ];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
