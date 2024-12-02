<?php

namespace App\Imports;

use App\Models\Estudiante;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Notification;
use App\Notifications\EstudianteRegistered; // Asegúrate de importar la notificación

class EstudiantesImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Ignorar filas incompletas
        if (empty($row['nombre_estudiante']) || empty($row['codigo_sis'])) {
            return null; // Ignorar filas sin datos esenciales
        }

        // Validar que 'codigo_sis' tenga exactamente 9 dígitos
        if (!preg_match('/^\d{9}$/', $row['codigo_sis'])) {
            throw new \Exception("El código SIS debe tener exactamente 9 dígitos.");
        }

        $docente = auth()->guard('sanctum')->user();
        $data = [
            'nombre_estudiante' => $row['nombre_estudiante'],
            'ap_pat' => $row['ap_pat'] ?? null,
            'ap_mat' => $row['ap_mat'] ?? null,
            'id_grupo' => $docente->id_grupo,
            'codigo_sis' => $row['codigo_sis'],
        ];

        // Solo agregar correo y contrasenia si existen
        if (isset($row['correo']) && !empty($row['correo'])) {
            $data['correo'] = $row['correo'];
        }

        if (isset($row['contrasenia']) && !empty($row['contrasenia'])) {
            $data['contrasenia'] = bcrypt($row['contrasenia']);
        } else {
            // Si no hay contraseña, puedes generar una por defecto
            $data['contrasenia'] = bcrypt('defaultPassword'); // Cambia esto según tu lógica
        }
        Notification::route('mail', $data['correo'])
                    ->notify(new EstudianteRegistered($data['nombre_estudiante'], $data['correo'], $row['contrasenia']));
        // Crear el estudiante
        $estudiante = new Estudiante($data);
        $estudiante->save();

        // Enviar notificación con el correo y contraseña
        // Notification::send($estudiante, new EstudianteRegistered($data['correo'], $data['contrasenia']));

        return $estudiante;
    }
}
