<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cruzada
 * 
 * @property int $id_cruzada
 * @property int|null $id_evaluacion
 * 
 * @property Evaluacion|null $evaluacion
 * @property Collection|DetalleReporte[] $detalle_reportes
 * @property Collection|Evaluacion[] $evaluacions
 *
 * @package App\Models
 */
class Cruzada extends Model
{
	protected $table = 'cruzada';
	protected $primaryKey = 'id_cruzada';
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

	public function detalle_reportes()
	{
		return $this->hasMany(DetalleReporte::class, 'id_cruzada');
	}

	public function evaluacions()
	{
		return $this->hasMany(Evaluacion::class, 'id_cruzada');
	}
}
