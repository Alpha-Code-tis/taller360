<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarea
 * 
 * @property int $id_tarea
 * @property int|null $id_alcance
 * @property string|null $nombre_tarea
 * 
 * @property Alcance|null $alcance
 *
 * @package App\Models
 */
class Tarea extends Model
{
	protected $table = 'tarea';
	protected $primaryKey = 'id_tarea';
	public $timestamps = false;

	protected $casts = [
		'id_alcance' => 'int'
	];

	protected $fillable = [
		'id_alcance',
		'nombre_tarea'
	];

	public function alcance()
	{
		return $this->belongsTo(Alcance::class, 'id_alcance');
	}
}
