<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Evaluacion
 * 
 * @property int $id_evaluacion
 * @property int|null $id_pares
 * @property int|null $id_cruzada
 * @property int|null $id_empresa
 * @property int|null $id_autoe
 * @property int|null $nota
 * @property Carbon|null $tiempo
 * 
 * @property Pare|null $pare
 * @property Cruzada|null $cruzada
 * @property Autoevaluacion|null $autoevaluacion
 * @property Empresa|null $empresa
 * @property Collection|Autoevaluacion[] $autoevaluacions
 * @property Collection|Cruzada[] $cruzadas
 * @property Collection|Pare[] $pares
 *
 * @package App\Models
 */
class Evaluacion extends Model
{
	protected $table = 'evaluacion';
	protected $primaryKey = 'id_evaluacion';
	public $timestamps = false;

	protected $casts = [
		'id_pares' => 'int',
		'id_cruzada' => 'int',
		'id_empresa' => 'int',
		'id_autoe' => 'int',
		'nota' => 'int',
		'tiempo' => 'datetime'
	];

	protected $fillable = [
		'id_pares',
		'id_cruzada',
		'id_empresa',
		'id_autoe',
		'nota',
		'tiempo'
	];

	public function pare()
	{
		return $this->belongsTo(Pare::class, 'id_pares');
	}

	public function cruzada()
	{
		return $this->belongsTo(Cruzada::class, 'id_cruzada');
	}

	public function autoevaluacion()
	{
		return $this->belongsTo(Autoevaluacion::class, 'id_autoe');
	}

	public function empresa()
	{
		return $this->belongsTo(Empresa::class, 'id_empresa');
	}

	public function autoevaluacions()
	{
		return $this->hasMany(Autoevaluacion::class, 'id_evaluacion');
	}

	public function cruzadas()
	{
		return $this->hasMany(Cruzada::class, 'id_evaluacion');
	}

	public function pares()
	{
		return $this->hasMany(Pare::class, 'id_evaluacion');
	}
}
