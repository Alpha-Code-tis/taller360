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
 * @property int $id_sprint
 * @property int|null $id_planificacion
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_fin
 * @property string|null $color
 * @property int|null $nro_sprint
 * 
 * @property Planificacion|null $planificacion
 * @property Collection|Alcance[] $alcances
 *
 * @package App\Models
 */
class Sprint extends Model
{
	protected $table = 'sprint';
	protected $primaryKey = 'id_sprint';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_sprint' => 'int',
		'id_planificacion' => 'int',
		'fecha_inicio' => 'datetime',
		'fecha_fin' => 'datetime',
		'nro_sprint' => 'int'
	];

	protected $fillable = [
		'id_planificacion',
		'fecha_inicio',
		'fecha_fin',
		'color',
		'nro_sprint'
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
