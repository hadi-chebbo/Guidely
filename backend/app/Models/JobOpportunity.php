<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobOpportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'major_id',
        'title_en',
        'title_ar',
        'description_en',
        'avg_salary_usd',
        'scope',
        'demand_level',
    ];

    protected $casts = [
        'avg_salary_usd' => 'integer',
    ];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
