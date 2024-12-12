<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cantidad
 * 
 * @property int $id_cantidad
 * @property int|null $id_empresa
 * @property int|null $cantidad
 * @property int|null $cant_min
 * @property int|null $cant_max
 * 
 * @property Empresa|null $empresa
 * @property Collection|Empresa[] $empresas
 *
 * @package App\Models
 */
class Cantidad extends Model
{
	protected $table = 'cantidad';
	protected $primaryKey = 'id_cantidad';
	public $timestamps = false;

	protected $casts = [
		'id_docente' => 'int',
		'gestion' => 'string',
		'cant_min' => 'int',
		'cant_max' => 'int',
		'fecha_ini',
		'fecha_final'
	];

	protected $fillable = [
		'id_docente' => 'int',
		'gestion' => 'string',
		'cant_min',
		'cant_max',
		'fecha_ini',
		'fecha_final'
	];

	public function docente()
	{
		return $this->belongsTo(Docente::class, 'id_docente');
	}

}
