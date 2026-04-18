<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;


class Faq extends Model
{
    /** @use HasFactory<\Database\Factories\FaqFactory> */
    use HasFactory;
    #[Fillable ([
        'major_id',
        'question',
        'answer',
        'sort_order',
    ])]
    
    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
