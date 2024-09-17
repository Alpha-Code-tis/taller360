<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class DetalleAuto
 * 
 * @property int $id_rep_auto
 * @property int|null $id_autoe
 * @property string|null $descripcion_auto
 * 
 * @property Autoevaluacion|null $autoevaluacion
 *
 * @package App\Models
 */
class DetalleAuto extends Model
{
	protected $table = 'detalle_auto';
	protected $primaryKey = 'id_rep_auto';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_rep_auto' => 'int',
		'id_autoe' => 'int'
	];

	protected $fillable = [
		'id_autoe',
		'descripcion_auto'
	];

	public function autoevaluacion()
	{
		return $this->belongsTo(Autoevaluacion::class, 'id_autoe');
	}
}
