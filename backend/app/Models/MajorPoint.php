<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MajorPoint extends Model
{
    /** @use HasFactory<\Database\Factories\MajorPointFactory> */
    use HasFactory;
    #[Fillable([
        'major_id',
        'type',
        'content',
    ])] 

    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
