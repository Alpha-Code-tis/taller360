<?php

namespace App\Imports;

use App\Models\Estudiante;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EstudiantesImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Ignorar filas incompletas
        if (empty($row['nombre_estudiante']) || empty($row['codigo_sis'])) {
            return null; // Ignorar filas sin datos esenciales
        }

        $data = [
            'nombre_estudiante' => $row['nombre_estudiante'],
            'ap_pat' => $row['ap_pat'] ?? null,
            'ap_mat' => $row['ap_mat'] ?? null,
            'codigo_sis' => $row['codigo_sis'],
        ];

        // Solo agregar correo y contrasenia si existen
        if (isset($row['correo']) && !empty($row['correo'])) {
            $data['correo'] = $row['correo'];
        }

        if (isset($row['contrasenia']) && !empty($row['contrasenia'])) {
            $data['contrasenia'] = bcrypt($row['contrasenia']);
        }

        return new Estudiante($data);
    }
}
