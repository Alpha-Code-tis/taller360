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
		'estimacion', 'estado', 'progreso', 'avances'];

    public function estudiantes()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiante_tarea', 'id_tarea', 'id_estudiante');
    }
    public $timestamps = false;

    public function alcance()
    {
        return $this->belongsTo(Alcance::class, 'id_alcance');
    }
}
