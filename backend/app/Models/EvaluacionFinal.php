<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluacionFinal extends Model
{
    use HasFactory;

    protected $table = 'evaluacion_final';
    public $timestamps = false;

    protected $fillable = [
        'id_est_evaluador',
        'id_est_evaluado',
        'resultado_escala',
        'resultado_comentario',
    ];

    public function evaluador()
    {
        return $this->belongsTo(Estudiante::class, 'id_est_evaluador', 'id_estudiante');
    }

    public function evaluado()
    {
        return $this->belongsTo(Estudiante::class, 'id_est_evaluado', 'id_estudiante');
    }
}
