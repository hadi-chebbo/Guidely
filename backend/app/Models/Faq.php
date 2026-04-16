<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    /** @use HasFactory<\Database\Factories\FaqFactory> */
    use HasFactory;
    protected $fillable = [
        'major_id',
        'question',
        'answer',
        'sort_order',
    ];
    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
