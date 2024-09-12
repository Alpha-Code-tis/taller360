<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Grupo
 * 
 * @property int $id
 * @property string|null $nombre
 * 
 * @property Collection|Planificacion[] $planificacions
 * @property Collection|RepresentanteLegal[] $representante_legals
 *
 * @package App\Models
 */
class Grupo extends Model
{
	protected $table = 'grupo';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function planificacions()
	{
		return $this->hasMany(Planificacion::class, 'id_grupo');
	}

	public function representante_legals()
	{
		return $this->hasMany(RepresentanteLegal::class, 'id_grupo');
	}
}
