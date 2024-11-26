<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cruzada extends Model
{
	use HasFactory;

	protected $table = 'cruzada';
	protected $primaryKey = 'id_cruzada'; // Define la clave primaria correcta
	protected $casts = [
		'detalle_notas' => 'array',
	];
	
	public $timestamps = false;

	protected $fillable = [
		'equipo_evaluador_id',
		'equipo_evaluado_id',
		'gestion',
		'nota_cruzada', // Nueva columna
	];

	public function evaluador()
	{
		return $this->belongsTo(Empresa::class, 'equipo_evaluador_id',  'id_empresa');
	}

	public function evaluado()
	{
		return $this->belongsTo(Empresa::class, 'equipo_evaluado_id',  'id_empresa');
	}
	public function criterios()
{
    return $this->belongsToMany(Criterio::class, 'evaluacion_criterio', 'id_cruzada', 'id_criterio');
}

}
