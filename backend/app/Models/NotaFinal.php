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
class NotaFinal extends Model
{
    use HasFactory;  // Agregamos HasFactory para soporte de factory.

    protected $table = 'nota_final';
    protected $primaryKey = 'id_nota_final';
    public $timestamps = false;

    protected $casts = [
        'id_notas_sprint' => 'int',
        'nota_total_sprint' => 'int',
        'notas_cruzada' => 'int',
        'nota_valor_sprint' => 'int',
        'nota_valor_cruzada' => 'int',
        'nota_fin' => 'int',
    ];

    protected $fillable = [
        'nota_total_sprint',
        'notas_cruzada',
        'nota_fin',
        'id_notas_sprint',
        'nota_valor_sprint',
        'nota_valor_cruzada',
    ];

    public function tarea()
    {
        return $this->belongsTo(NotasSprint::class, 'id_notas_sprints');
    }
}
