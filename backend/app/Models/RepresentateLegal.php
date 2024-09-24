<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RepresentateLegal
 * 
 * @property int $id_representante
 * @property int|null $estado
 * 
 * @property Collection|Estudiante[] $estudiantes
 *
 * @package App\Models
 */
class RepresentateLegal extends Model
{
    protected $table = 'representate_legal';
    protected $primaryKey = 'id_representante';
    public $timestamps = false;

    protected $casts = [
        'estado' => 'int'
    ];

    protected $fillable = [
        'estado'
    ];

    // Eliminar relación con empresa, ya que no se requiere
    // public function empresa()
    // {
    //     return $this->belongsTo(Empresa::class, 'id_empresa');
    // }

    // Eliminar método de empresas, ya que no se requiere
    // public function empresas()
    // {
    //     return $this->hasMany(Empresa::class, 'id_representante');
    // }

    // Mantener relación con Estudiante
    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class, 'id_representante');
    }
}
