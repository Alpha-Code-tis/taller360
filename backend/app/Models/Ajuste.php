<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ajuste extends Model
{
    use HasFactory;

    // Define la tabla asociada
    protected $table = 'ajustes';

    // Habilita la asignación masiva para estos campos
    protected $fillable = [
        'fecha_inicio_autoevaluacion',
        'fecha_fin_autoevaluacion',
        'fecha_inicio_eva_final',
        'fecha_fin_eva_final',
        'fecha_inicio_eva_cruzada',
        'fecha_fin_eva_cruzada',
        'nota_pares'
    ];

    // Deshabilita las marcas de tiempo automáticas si no necesitas created_at y updated_at
    public $timestamps = false;
}
