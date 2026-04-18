<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

  #[Fillable ([
        'major_id',
        'question',
        'answer',
        'sort_order',
    ])]
    
class Faq extends Model
{
    /** @use HasFactory<\Database\Factories\FaqFactory> */
    use HasFactory;
  
    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
