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
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_cantidad' => 'int',
		'id_empresa' => 'int',
		'cantidad' => 'int',
		'cant_min' => 'int',
		'cant_max' => 'int'
	];

	protected $fillable = [
		'id_empresa',
		'cantidad',
		'cant_min',
		'cant_max'
	];

	public function empresa()
	{
		return $this->belongsTo(Empresa::class, 'id_empresa');
	}

	public function empresas()
	{
		return $this->hasMany(Empresa::class, 'id_cantidad');
	}
}
