<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
class Administrador extends Authenticatable
{
	protected $table = 'administrador';
	protected $primaryKey = 'id_admi';
	public $timestamps = false;
	use HasApiTokens, Notifiable;

	protected $fillable = [
		'nombre',
		'contrasenia',
		'correo'
	];

	public function docentes()
	{
		return $this->hasMany(Docente::class, 'id_admi');
	}
	protected $hidden = [
        'contrasenia',
    ];

    public function getAuthPassword()
    {
        return $this->contrasenia;
    }
}
