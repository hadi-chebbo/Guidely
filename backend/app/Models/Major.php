<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Major extends Model
{
    use HasFactory;

    public function universities(): BelongsToMany
    {
        return $this->belongsToMany(University::class, 'university_majors')
            ->withPivot([
                'credit_price_usd',
                'total_credits',
                'admission_requirements',
                'language_of_instruction',
                'has_scholarship',
                'campus',
            ])
            ->withTimestamps();
    }

    public function universityMajors(): HasMany
    {
        return $this->hasMany(UniversityMajor::class);
    }

    public function jobOpportunities(): HasMany
    {
        return $this->hasMany(JobOpportunity::class);
    }

    public function hiringCompanies(): HasMany
    {
        return $this->hasMany(HiringCompany::class);
    }

    public function marketTrends(): HasMany
    {
        return $this->hasMany(MarketTrend::class);
    }
}
