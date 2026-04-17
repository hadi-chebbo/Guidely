<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'major_id',
    'company_name',
    'industry',
    'location',
    'logo_url',
    'website_url',
    'is_local',
])]
class HiringCompany extends Model
{
    use HasFactory;

    protected $casts = [
        'is_local' => 'boolean',
    ];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
