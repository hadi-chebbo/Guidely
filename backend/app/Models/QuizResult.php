<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'answers',
    'category_scores',
    'skill_scores'
])]

class QuizResult extends Model
{
    use HasFactory;
    protected function casts()
    {
        return [
            'answers' => 'array',
            'category_scores' => 'array',
            'skill_scores' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
