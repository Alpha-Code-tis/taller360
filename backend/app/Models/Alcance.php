<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Alcance
 * 
 * @property int $id
 * @property string|null $nombre
 * @property int|null $id_sprint
 * 
 * @property Sprint|null $sprint
 * @property Collection|Comentario[] $comentarios
 * @property Collection|Tarea[] $tareas
 *
 * @package App\Models
 */
class Alcance extends Model
{
	protected $table = 'alcance';
	public $timestamps = false;

	protected $casts = [
		'id_sprint' => 'int'
	];

	protected $fillable = [
		'nombre',
		'id_sprint'
	];

	public function sprint()
	{
		return $this->belongsTo(Sprint::class, 'id_sprint');
	}

	public function comentarios()
	{
		return $this->hasMany(Comentario::class, 'id_alcance');
	}

	public function tareas()
	{
		return $this->hasMany(Tarea::class, 'id_alcance');
	}
}
