<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'major_id',
    'title_en',
    'title_ar',
    'description_en',
    'avg_salary_usd',
    'scope',
    'demand_level',
])]
class JobOpportunity extends Model
{
    use HasFactory;

    protected $casts = [
        'avg_salary_usd' => 'integer',
    ];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
