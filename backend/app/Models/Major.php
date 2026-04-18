<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
        'name_en',
        'name_ar',
        'category_id',
        'slug',
        'overview',
        'description',
        'duration_years',
        'difficulty_level',
        'salary_min',
        'salary_max',
        'local_demand',
        'international_demand',
        'is_featured',
        'cover_image',
    ])] 
class Major extends Model
{
    use HasFactory;
    public function points()
    {
        return $this->hasMany(MajorPoint::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function faqs()
    {
        return $this->hasMany(Faq::class);
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
    public function skills(){
        return $this->hasMany(Skill::class);
    }
}
