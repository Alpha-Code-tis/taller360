<?php

/**
 * Created by Reliese Model.
 */


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarea
 *
 * @property int $id_tarea
 * @property int|null $id_alcance
 * @property string|null $nombre_tarea
 *
 * @property Alcance|null $alcance
 *
 * @package App\Models
 */
class Tarea extends Model
{
    use HasFactory;

    protected $table = 'tarea';
    protected $primaryKey = 'id_tarea';
    protected $fillable = ['nombre_tarea',
		'estimacion', 'estado', 'progreso', 'avances', 'calificion', 'observaciones', 'revisado'];

    public function estudiante()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiante_tarea', 'id_tarea', 'id_estudiante');
    }

    public function estudiantes()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiante_tarea', 'id_tarea', 'id_estudiante')
                    ->withPivot('resultado_evaluacion', 'descripcion_evaluacion'); // Incluye las columnas necesarias
    }
    public $timestamps = false;

    public function alcance()
    {
        return $this->belongsTo(Alcance::class, 'id_alcance');
    }

    // Relación con Criterios
    public function criterios()
    {
        return $this->hasMany(Criterio::class, 'tarea_id', 'tarea_id');
    }

    // Relación con Evaluaciones
    public function evaluacion()
    {
        return $this->hasMany(Evaluacion::class, 'tarea_id');
    }
    
}
