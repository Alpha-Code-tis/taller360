<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Notificacion
 * 
 * @property string $id_notificacion
 * @property string|null $descripcion
 * @property Carbon|null $fecha
 * 
 * @property Collection|Estudiante[] $estudiantes
 *
 * @package App\Models
 */
class Notificacion extends Model
{
	protected $table = 'notificacion';
	protected $primaryKey = 'id_notificacion';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'descripcion',
		'fecha'
	];

	public function estudiantes()
	{
		return $this->hasMany(Estudiante::class, 'id_notificacion');
	}
}
