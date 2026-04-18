<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

 #[Fillable([
    'name',
    'type',
    'icon',
 ])]

class Skill extends Model
{
    /** @use HasFactory<\Database\Factories\SkillFactory> */
    use HasFactory;

    public function majors()
    {
        return $this->belongsToMany(Major::class);
    }
}
