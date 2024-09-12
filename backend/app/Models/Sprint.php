<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Sprint
 * 
 * @property int $id
 * @property int|null $n_sprint
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_fin
 * @property string|null $color
 * @property int|null $id_planificacion
 * 
 * @property Planificacion|null $planificacion
 * @property Collection|Alcance[] $alcances
 *
 * @package App\Models
 */
class Sprint extends Model
{
	protected $table = 'sprint';
	public $timestamps = false;

	protected $casts = [
		'n_sprint' => 'int',
		'fecha_inicio' => 'datetime',
		'fecha_fin' => 'datetime',
		'id_planificacion' => 'int'
	];

	protected $fillable = [
		'n_sprint',
		'fecha_inicio',
		'fecha_fin',
		'color',
		'id_planificacion'
	];

	public function planificacion()
	{
		return $this->belongsTo(Planificacion::class, 'id_planificacion');
	}

	public function alcances()
	{
		return $this->hasMany(Alcance::class, 'id_sprint');
	}
}
