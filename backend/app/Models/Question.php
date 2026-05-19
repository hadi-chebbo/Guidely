<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'text_en',
    'text_ar',
    'section',
    'order',
])]

class Question extends Model
{
    use HasFactory;

    public function options()
    {
        return $this->hasMany(QuestionOption::class);
    }
}
