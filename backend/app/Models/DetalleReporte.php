<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class DetalleReporte
 * 
 * @property int $id_rep_det
 * @property int|null $id_cruzada
 * @property string|null $descripcion_cruzada
 * 
 * @property Cruzada|null $cruzada
 *
 * @package App\Models
 */
class DetalleReporte extends Model
{
	protected $table = 'detalle_reporte';
	protected $primaryKey = 'id_rep_det';
	public $timestamps = false;

	protected $casts = [
		'id_cruzada' => 'int'
	];

	protected $fillable = [
		'id_cruzada',
		'descripcion_cruzada'
	];

	public function cruzada()
	{
		return $this->belongsTo(Cruzada::class, 'id_cruzada');
	}
}
