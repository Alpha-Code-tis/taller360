<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Pare
 * 
 * @property int $id_pares
 * @property int|null $id_evaluacion
 * 
 * @property Evaluacion|null $evaluacion
 * @property Collection|DetallePar[] $detalle_pars
 * @property Collection|Evaluacion[] $evaluacions
 *
 * @package App\Models
 */
class Pare extends Model
{
	protected $table = 'pares';
	protected $primaryKey = 'id_pares';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_pares' => 'int',
		'id_evaluacion' => 'int'
	];

	protected $fillable = [
		'id_evaluacion'
	];

	public function evaluacion()
	{
		return $this->belongsTo(Evaluacion::class, 'id_evaluacion');
	}

	public function detalle_pars()
	{
		return $this->hasMany(DetallePar::class, 'id_pares');
	}

	public function evaluacions()
	{
		return $this->hasMany(Evaluacion::class, 'id_pares');
	}
}
