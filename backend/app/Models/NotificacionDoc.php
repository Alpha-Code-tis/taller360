<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionDoc
 * 
 * @property int $id_noti
 * @property string|null $descripcion_not
 * 
 * @property Collection|Docente[] $docentes
 *
 * @package App\Models
 */
class NotificacionDoc extends Model
{
	protected $table = 'notificacion_doc';
	protected $primaryKey = 'id_noti';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_noti' => 'int'
	];

	protected $fillable = [
		'descripcion_not'
	];

	public function docentes()
	{
		return $this->hasMany(Docente::class, 'id_noti');
	}
}
