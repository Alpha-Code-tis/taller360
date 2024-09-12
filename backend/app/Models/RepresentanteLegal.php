<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class RepresentanteLegal
 * 
 * @property int $id_estudiante
 * @property int $id_grupo
 * 
 * @property Estudiante $estudiante
 * @property Grupo $grupo
 *
 * @package App\Models
 */
class RepresentanteLegal extends Model
{
	protected $table = 'representante_legal';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_estudiante' => 'int',
		'id_grupo' => 'int'
	];

	public function estudiante()
	{
		return $this->belongsTo(Estudiante::class, 'id_estudiante');
	}

	public function grupo()
	{
		return $this->belongsTo(Grupo::class, 'id_grupo');
	}
}
