<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Administrador
 * 
 * @property int $id_admi
 * @property string|null $nombre
 * @property string|null $contrasenia
 * 
 * @property Collection|Docente[] $docentes
 *
 * @package App\Models
 */
class Administrador extends Model
{
	protected $table = 'administrador';
	protected $primaryKey = 'id_admi';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_admi' => 'int'
	];

	protected $fillable = [
		'nombre',
		'contrasenia'
	];

	public function docentes()
	{
		return $this->hasMany(Docente::class, 'id_admi');
	}
}
