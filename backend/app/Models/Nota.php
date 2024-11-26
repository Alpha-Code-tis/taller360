<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    // Definir el nombre de la tabla asociada (opcional si sigue la convención de plural)
    protected $table = 'notas';

    // Indicar si la tabla tiene o no un campo de marca de tiempo (created_at, updated_at)
    public $timestamps = true;  // Esto es por defecto, se puede omitir si quieres que Laravel lo maneje automáticamente.

    // Definir los campos que pueden ser llenados masivamente (opcional)
    protected $fillable = [
        'autoevaluacion',
        'pares',
        'evaluaciondocente',
        'paga',
        'id_docente', // Clave foránea
        'id_sprint',
        'id_empresa',
    ];

    // Relación inversa con la tabla Docente
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'id_docente', 'id_docente'); // Relación muchos a uno con el docente
    }
}
