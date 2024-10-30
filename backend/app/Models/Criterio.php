<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Criterio extends Model
{
    protected $table = 'criterios';
    protected $primaryKey = 'id_criterio';
    protected $fillable = ['id_criterio','nombre', 'descripcion', 'ponderacion'];

    // Relación muchos a muchos con evaluaciones cruzadas
    public function cruzadas(): BelongsToMany
    {
        return $this->belongsToMany(Cruzada::class, 'evaluacion_criterio')
                    ->withPivot('nota') // Acceso a la nota en la tabla pivote
                    ->withTimestamps();
    }
}
