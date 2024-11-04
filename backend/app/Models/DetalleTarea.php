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
 * @property int $id_detalle_tarea
 * @property int|null $id_tarea
 * @property string|null $nom_tarea
 *
 * @property Tarea|null $tarea
 *
 * @package App\Models
 */
class DetalleTarea extends Model
{
    use HasFactory;

    protected $table = 'detalle_tarea';
    protected $primaryKey = 'id_detalle_tarea';
    protected $fillable = ['nom_estudiante', 'nom_tarea', 'calificacion_tarea', 'observaciones_tarea','revisado_tarea', 'revisado_semanas','semana_sprint'];

    public function tarea()
    {
        return $this->belongsToMany(Tarea::class, 'det_tarea', 'id_detalle_tarea', 'id_tarea');
    }
    public $timestamps = false;

}
