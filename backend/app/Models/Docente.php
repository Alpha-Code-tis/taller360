<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

/**
 * Class Docente
 * 
 * @property int $id_docente
 * @property int|null $id_noti
 * @property int|null $id_admi
 * @property int|null $id_grupo
 * @property string|null $nombre_docente
 * @property string|null $ap_pat
 * @property string|null $ap_mat
 * @property string|null $contrasenia
 * @property string|null $correo
 * 
 * @property NotificacionDoc|null $notificacion_doc
 * @property Administrador|null $administrador
 * @property Grupo|null $grupo
 * @property Collection|Grupo[] $grupos
 *
 * @package App\Models
 */
class Docente extends Model
{
	protected $table = 'docente';
	protected $primaryKey = 'id_docente';
	public $timestamps = false;
	use Notifiable;

	protected $casts = [
		'id_noti' => 'int',
		'id_admi' => 'int',
		'id_grupo' => 'int'
	];

	protected $fillable = [
		'id_noti',
		'id_admi',
		'id_grupo',
		'nombre_docente',
		'ap_pat',
		'ap_mat',
		'contrasenia',
		'correo'
	];

	public function notificacion_doc()
	{
		return $this->belongsTo(NotificacionDoc::class, 'id_noti');
	}

	public function administrador()
	{
		return $this->belongsTo(Administrador::class, 'id_admi');
	}

	public function grupo()
	{
		return $this->belongsTo(Grupo::class, 'id_grupo');
	}

	public function setCorreoAttribute($value)
    {
        $this->attributes['correo'] = strtolower($value);
    }

	public function setContraseniaAttribute($value)
    {
        $this->attributes['contrasenia'] = Hash::make($value);
    }

	public function grupos()
	{
		return $this->hasMany(Grupo::class, 'id_docente');
	}
}
