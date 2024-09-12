<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Estudiante
 * 
 * @property int $id
 * @property string|null $nombre
 * @property string|null $apellido
 * @property string|null $email
 * @property int|null $id_grupo
 * 
 * @property Collection|RepresentanteLegal[] $representante_legals
 *
 * @package App\Models
 */
class Estudiante extends Model
{
	protected $table = 'estudiante';
	public $timestamps = false;

	protected $casts = [
		'id_grupo' => 'int'
	];

	protected $fillable = [
		'nombre',
		'apellido',
		'email',
		'id_grupo'
	];

	public function representante_legals()
	{
		return $this->hasMany(RepresentanteLegal::class, 'id_estudiante');
	}
}
