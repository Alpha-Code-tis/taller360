<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
 * 
 * @property Notificacion|null $notificacion
 * @property Grupo|null $grupo
 * @property RepresentateLegal|null $representate_legal
 *
 * @package App\Models
 */
class Estudiante extends Model
{
	protected $table = 'estudiante';
	protected $primaryKey = 'id_estudiante';
	public $timestamps = false;

	protected $casts = [
		'id_grupo' => 'int',
		'id_representante' => 'int',
		'codigo_sis' => 'int'
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
		'contrasenia'
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
}
