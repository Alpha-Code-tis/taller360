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
 * @property int $id_notas
 * @property int|null $NotaTarea
 * @property int|null $NotaEvPares
 * @property int|null $NotaAutoEv
 * @property int|null $Identifier_1
 *
 * @package App\Models
 */
class NotasSprint extends Model
{
    use HasFactory;

    protected $table = 'notas';
    protected $primaryKey = 'id_notas';
    protected $fillable = [
        'NotaTarea',
        'NotaEvPares',
        'NotaAutoEv',
        'Identifier_1'
    ];

    public $timestamps = false;

    // Assuming Identifier_1 is a foreign key reference to another table, for example, Estudiante
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'Identifier_1');
    }
}
