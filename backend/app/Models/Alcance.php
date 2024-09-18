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
 * @property int $id_alcance
 * @property int|null $id_sprint
 * @property string|null $descripcion
 * 
 * @property Sprint|null $sprint
 * @property Collection|Tarea[] $tareas
 *
 * @package App\Models
 */
class Alcance extends Model
{
	protected $table = 'alcance';
	protected $primaryKey = 'id_alcance';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_alcance' => 'int',
		'id_sprint' => 'int'
	];

	protected $fillable = [
		'id_sprint',
		'descripcion'
	];

	public function sprint()
	{
		return $this->belongsTo(Sprint::class, 'id_sprint');
	}

	public function tareas()
	{
		return $this->hasMany(Tarea::class, 'id_alcance');
	}
}
