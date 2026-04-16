<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    /** @use HasFactory<\Database\Factories\SkillFactory> */
    use HasFactory;
     protected $fillable = [
        'name',
        'type',
        'icon',
    ];

    public function majors()
    {
        return $this->belongsToMany(Major::class);
    }
}
