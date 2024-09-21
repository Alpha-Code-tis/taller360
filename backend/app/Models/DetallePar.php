<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class DetallePar
 * 
 * @property int $id_det_par
 * @property int|null $id_pares
 * @property string|null $descripcion_par
 * 
 * @property Pare|null $pare
 *
 * @package App\Models
 */
class DetallePar extends Model
{
	protected $table = 'detalle_par';
	protected $primaryKey = 'id_det_par';
	public $timestamps = false;

	protected $casts = [
		'id_pares' => 'int'
	];

	protected $fillable = [
		'id_pares',
		'descripcion_par'
	];

	public function pare()
	{
		return $this->belongsTo(Pare::class, 'id_pares');
	}
}
