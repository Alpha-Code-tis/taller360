<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotasSprint
 *
 * @property int $id_notas_sprint
 * @property int|null $nota_tarea
 * @property int|null $nota_ev_pares
 * @property int|null $nota_auto_ev
 * @property int|null $id_tarea
 *
 * @package App\Models
 */
class NotasSprint extends Model
{
    use HasFactory;  // Agregamos HasFactory para soporte de factory.

    protected $table = 'notas_sprints';
    protected $primaryKey = 'id_notas_sprint';
    public $timestamps = false;

    protected $casts = [
        'id_tarea' => 'int',
        'nota_tarea' => 'int',
        'nota_ev_pares' => 'int',
        'nota_auto_ev' => 'int',
    ];

    protected $fillable = [
        'nota_tarea',
        'nota_ev_pares',
        'nota_auto_ev',
        'id_tarea',
    ];

    public function tarea()
    {
        return $this->belongsTo(Tarea::class, 'id_tarea');
    }
}
