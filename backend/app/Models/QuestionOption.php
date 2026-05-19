<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'text_en',
    'text_ar',
    'weights',
])]

class QuestionOption extends Model
{
    protected $casts = [
        'weights' => 'array',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
