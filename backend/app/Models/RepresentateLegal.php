<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RepresentateLegal
 * 
 * @property int $id_representante
 * @property int|null $id_empresa
 * @property int|null $estado
 * 
 * @property Empresa|null $empresa
 * @property Collection|Empresa[] $empresas
 * @property Collection|Estudiante[] $estudiantes
 *
 * @package App\Models
 */
class RepresentateLegal extends Model
{
	protected $table = 'representate_legal';
	protected $primaryKey = 'id_representante';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_representante' => 'int',
		'id_empresa' => 'int',
		'estado' => 'int'
	];

	protected $fillable = [
		'id_empresa',
		'estado'
	];

	public function empresa()
	{
		return $this->belongsTo(Empresa::class, 'id_empresa');
	}

	public function empresas()
	{
		return $this->hasMany(Empresa::class, 'id_representante');
	}

	public function estudiantes()
	{
		return $this->hasMany(Estudiante::class, 'id_representante');
	}
}
