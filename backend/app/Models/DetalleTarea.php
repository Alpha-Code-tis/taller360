<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleTarea extends Model
{
    protected $table = 'detalle_tarea';
    protected $primaryKey = 'id_detalle_tarea';
    public $timestamps = false;

    protected $fillable = [
        'id_tarea',
        'semana_sprint',
        'nom_estudiante',
        'nom_tarea',
        'calificacion_tarea',
        'observaciones_tarea',
        'revisado_tarea',
        'revisado_semanas',
    ];

    public function tarea()
    {
        return $this->belongsTo(Tarea::class, 'id_tarea', 'id_tarea');
    }
}
