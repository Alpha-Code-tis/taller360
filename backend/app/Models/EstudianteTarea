<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EstudianteTarea
 * 
 * @property int $id_estudiante
 * @property int $id_tarea
 * 
 * @property Estudiante $estudiante
 * @property Tarea $tarea
 *
 * @package App\Models
 */
class EstudianteTarea extends Model
{
    protected $table = 'estudiante_tarea';
    public $timestamps = false;
    public $incrementing = false; // Como no tiene llave primaria autoincremental

    protected $casts = [
        'id_estudiante' => 'int',
        'id_tarea' => 'int'
    ];

    protected $fillable = [
        'id_estudiante',
        'id_tarea'
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'id_estudiante');
    }

    public function tarea()
    {
        return $this->belongsTo(Tarea::class, 'id_tarea');
    }
}
