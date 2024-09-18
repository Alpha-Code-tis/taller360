<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Planificacion
 * 
 * @property int $id_planificacion
 * @property int|null $id_empresa
 * @property int|null $cant_sprints
 * 
 * @property Empresa|null $empresa
 * @property Collection|Empresa[] $empresas
 * @property Collection|Sprint[] $sprints
 *
 * @package App\Models
 */
class Planificacion extends Model
{
	protected $table = 'planificacion';
	protected $primaryKey = 'id_planificacion';
	public $timestamps = false;

	protected $casts = [
		'id_empresa' => 'int',
		'cant_sprints' => 'int'
	];

	protected $fillable = [
		'id_empresa',
		'cant_sprints'
	];

	public function empresa()
	{
		return $this->belongsTo(Empresa::class, 'id_empresa');
	}

	public function empresas()
	{
		return $this->hasMany(Empresa::class, 'id_planificacion');
	}

	public function sprints()
	{
		return $this->hasMany(Sprint::class, 'id_planificacion');
	}
}
