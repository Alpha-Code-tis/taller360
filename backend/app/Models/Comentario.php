<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Comentario
 * 
 * @property int $id
 * @property string $comentario
 * @property Carbon $fecha_comentario
 * @property int|null $id_alcance
 * 
 * @property Alcance|null $alcance
 *
 * @package App\Models
 */
class Comentario extends Model
{
	protected $table = 'comentario';
	public $timestamps = false;

	protected $casts = [
		'fecha_comentario' => 'datetime',
		'id_alcance' => 'int'
	];

	protected $fillable = [
		'comentario',
		'fecha_comentario',
		'id_alcance'
	];

	public function alcance()
	{
		return $this->belongsTo(Alcance::class, 'id_alcance');
	}
}
