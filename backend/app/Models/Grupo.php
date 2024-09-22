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
 * @property int $id_grupo
 * @property int|null $id_docente
 * @property string|null $nro_grupo
 * 
 * @property Docente|null $docente
 * @property Collection|Estudiante[] $estudiantes
 *
 * @package App\Models
 */
class Grupo extends Model
{
	protected $table = 'grupo';
	protected $primaryKey = 'id_grupo';
	public $timestamps = false;

	protected $casts = [
		'id_docente' => 'int'
	];

	protected $fillable = [
		'id_docente',
		'nro_grupo'
	];

	public function docente()
	{
		return $this->belongsTo(Docente::class, 'id_docente');
	}

	public function estudiantes()
	{
		return $this->hasMany(Estudiante::class, 'id_grupo');
	}
}
