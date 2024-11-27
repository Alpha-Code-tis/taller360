<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Empresa
 * 
 * @property int $id_empresa
 * @property int|null $id_cantidad
 * @property int|null $id_representante
 * @property int|null $id_planificacion
 * @property string|null $nombre_empresa
 * @property string|null $nombre_corto
 * @property string|null $direccion
 * @property string|null $telefono
 * @property string|null $correo_empresa
 * 
 * @property RepresentateLegal|null $representate_legal
 * @property Cantidad|null $cantidad
 * @property Planificacion|null $planificacion
 * @property Collection|Cantidad[] $cantidads
 * @property Collection|Evaluacion[] $evaluacions
 * @property Collection|Planificacion[] $planificacions
 * @property Collection|RepresentateLegal[] $representate_legals
 *
 * @package App\Models
 */
class Empresa extends Model
{
	protected $table = 'empresa';
	protected $primaryKey = 'id_empresa';
	public $timestamps = false;

	protected $casts = [
		'id_cantidad' => 'int',
		'id_representante' => 'int',
		'id_planificacion' => 'int'
	];

	protected $fillable = [
		'id_cantidad',
		'id_representante',
		'id_planificacion',
		'nombre_empresa',
		'nombre_corto',
		'direccion',
		'telefono',
		'correo_empresa',
		'logo',
		'gestion',
		'drive_link',
		'especificaciones',
	];

	public function representate_legal()
	{
		return $this->belongsTo(RepresentateLegal::class, 'id_representante');
	}

	public function cantidad()
	{
		return $this->belongsTo(Cantidad::class, 'id_cantidad');
	}

	public function planificacion()
	{
		return $this->belongsTo(Planificacion::class, 'id_planificacion');
	}

	public function cantidads()
	{
		return $this->hasMany(Cantidad::class, 'id_empresa');
	}

	public function criterios()
	{
		return $this->hasMany(Criterio::class, 'empresa_id', 'id_empresa');
	}

	public function planificacions()
	{
		return $this->hasMany(Planificacion::class, 'id_empresa');
	}

	public function representate_legals()
	{
		return $this->hasMany(RepresentateLegal::class, 'id_empresa');
	}
	public function estudiantes() 
	{
		return $this->hasMany(Estudiante::class, 'id_empresa', 'id_empresa');
	}
	public function tareas()
	{
		return $this->hasMany(Tarea::class, 'id_empresa', 'id_empresa');
	}
	public function evaluador()
	{
		return $this->belongsTo(Empresa::class, 'equipo_evaluador_id');
	}

	public function evaluado()
	{
		return $this->belongsTo(Empresa::class, 'equipo_evaluado_id');
	}
	
	public function evaluacionesCruzadas()
	{
		return $this->hasMany(Cruzada::class, 'equipo_evaluado_id');
	}
}
