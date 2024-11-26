<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Criterio extends Model
{
    protected $table = 'criterios';
    protected $primaryKey = 'id_criterio';
    protected $fillable = ['id_criterio','nombre', 'descripcion', 'porcentaje', 'tarea_id'];

    // Relación muchos a muchos con evaluaciones cruzadas
    public function cruzadas(): BelongsToMany
    {
        return $this->belongsToMany(Cruzada::class, 'evaluacion_criterio')
                    ->withPivot('nota') // Acceso a la nota en la tabla pivote
                    ->withTimestamps();
    }

    public function evaluadores()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiante_criterio', 'id_criterio', 'id_estudiante_evaluador');
    }

    public function evaluados()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiante_criterio', 'id_criterio', 'id_estudiante_evaluado');
    }

    // Relación con Tarea
    public function tarea()
    {
        return $this->belongsTo(Tarea::class, 'tarea_id');
    }
    public function empresa()
{
    return $this->belongsTo(Empresa::class, 'empresa_id', 'id_empresa');
}

}
