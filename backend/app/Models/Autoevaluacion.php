<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Autoevaluacion
 * 
 * @property int $id_autoe
 * @property int|null $id_evaluacion
 * 
 * @property Evaluacion|null $evaluacion
 * @property Collection|DetalleAuto[] $detalle_autos
 * @property Collection|Evaluacion[] $evaluacions
 *
 * @package App\Models
 */
class Autoevaluacion extends Model
{
	protected $table = 'autoevaluacion';
	protected $primaryKey = 'id_autoe';
	public $timestamps = false;

	protected $casts = [
		'id_evaluacion' => 'int'
	];

	protected $fillable = [
		'id_evaluacion'
	];

	public function evaluacion()
	{
		return $this->belongsTo(Evaluacion::class, 'id_evaluacion');
	}

	public function detalle_autos()
	{
		return $this->hasMany(DetalleAuto::class, 'id_autoe');
	}

	public function evaluacions()
	{
		return $this->hasMany(Evaluacion::class, 'id_autoe');
	}
}
