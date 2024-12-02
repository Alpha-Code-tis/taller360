<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcriterio extends Model
{
    use HasFactory;

    protected $fillable = ['id_criterio', 'descripcion', 'porcentaje'];

    public function criterio()
    {
        return $this->belongsTo(Criterio::class, 'criterio_id');
    }
}
