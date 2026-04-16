<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;
    protected $fillable = [
        'name_en',
        'name_ar',
        'slug',
        'description',
        'icon',
        'is_active',
    ];

    public function majors()
    {
        return $this->hasMany(Major::class);
    }
}
