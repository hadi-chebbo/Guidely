<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name_en',
    'name_ar',
    'slug',
    'type',
    'location',
    'website',
    'logo_url',
    'description_en',
    'description_ar',
    'founded_year',
    'accreditation',
])]
class University extends Model
{
    use HasFactory;

    protected $casts = [
        'founded_year' => 'integer',
    ];

    public function universityMajors(): HasMany
    {
        return $this->hasMany(UniversityMajor::class);
    }
}
