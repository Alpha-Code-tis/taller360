<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarea
 * 
 * @property int $id
 * @property string|null $nombre
 * @property int|null $id_alcance
 * 
 * @property Alcance|null $alcance
 *
 * @package App\Models
 */
class Tarea extends Model
{
	protected $table = 'tarea';
	public $timestamps = false;

	protected $casts = [
		'id_alcance' => 'int'
	];

	protected $fillable = [
		'nombre',
		'id_alcance'
	];

	public function alcance()
	{
		return $this->belongsTo(Alcance::class, 'id_alcance');
	}
}
