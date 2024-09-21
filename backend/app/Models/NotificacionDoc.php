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
	public $timestamps = false;

	protected $fillable = [
		'descripcion_not'
	];

	public function docentes()
	{
		return $this->hasMany(Docente::class, 'id_noti');
	}
}
