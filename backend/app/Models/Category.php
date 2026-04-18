<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
  #[Fillable([
        'name_en',
        'name_ar',
        'slug',
        'description',
        'icon',
        'is_active',
    ])]


class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;
    
  

    public function majors()
    {
        return $this->hasMany(Major::class);
    }
}
