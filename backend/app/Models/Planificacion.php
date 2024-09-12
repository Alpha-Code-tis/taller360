<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Planificacion
 * 
 * @property int $id
 * @property Carbon|null $fecha_creacion
 * @property int|null $id_grupo
 * 
 * @property Grupo|null $grupo
 * @property Collection|Sprint[] $sprints
 *
 * @package App\Models
 */
class Planificacion extends Model
{
	protected $table = 'planificacion';
	public $timestamps = false;

	protected $casts = [
		'fecha_creacion' => 'datetime',
		'id_grupo' => 'int'
	];

	protected $fillable = [
		'fecha_creacion',
		'id_grupo'
	];

	public function grupo()
	{
		return $this->belongsTo(Grupo::class, 'id_grupo');
	}

	public function sprints()
	{
		return $this->hasMany(Sprint::class, 'id_planificacion');
	}
}
