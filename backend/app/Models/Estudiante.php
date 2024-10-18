<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class Estudiante
 *
 * @property int $id_estudiante
 * @property string|null $id_notificacion
 * @property int|null $id_grupo
 * @property int|null $id_representante
 * @property string|null $nombre_estudiante
 * @property string|null $ap_pat
 * @property string|null $ap_mat
 * @property int|null $codigo_sis
 * @property string|null $correo
 * @property string|null $contrasenia
 * @property int|null $id_empresa // Nueva propiedad
 *
 * @property Notificacion|null $notificacion
 * @property Grupo|null $grupo
 * @property RepresentateLegal|null $representate_legal
 *
 * @package App\Models
 */
class Estudiante extends Authenticatable
{
    protected $table = 'estudiante';
    protected $primaryKey = 'id_estudiante';
    public $timestamps = false;
    use HasApiTokens, Notifiable;

    protected $casts = [
        'id_grupo' => 'int',
        'id_representante' => 'int',
        'codigo_sis' => 'int',
        'id_empresa' => 'int' // Asegúrate de que sea un entero
    ];

    protected $fillable = [
        'id_notificacion',
        'id_grupo',
        'id_representante',
        'nombre_estudiante',
        'ap_pat',
        'ap_mat',
        'codigo_sis',
        'correo',
        'contrasenia',
        'id_empresa' // Añadir aquí
    ];

    public function notificacion()
    {
        return $this->belongsTo(Notificacion::class, 'id_notificacion');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo');
    }

    public function representate_legal()
    {
        return $this->belongsTo(RepresentateLegal::class, 'id_representante');
    }
    public function empresa() // Nueva relación
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
    protected $hidden = [
        'contrasenia',
    ];

    public function getAuthPassword()
    {
        return $this->contrasenia;
    }

    public function tareas()
    {
        return $this->belongsToMany(Tarea::class, 'estudiante_tarea', 'id_estudiante', 'id_tarea')
            ->withPivot('resultado_evaluacion', 'descripcion_evaluacion');
    }
}
