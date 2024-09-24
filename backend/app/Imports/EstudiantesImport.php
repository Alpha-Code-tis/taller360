<?php

namespace App\Imports;

use App\Models\Estudiante;
use Maatwebsite\Excel\Concerns\ToModel;

class EstudiantesImport implements ToModel
{
    public function model(array $row)
    {
        $data = [
            'nombre_estudiante' => $row[0] ?? null,
            'ap_pat' => $row[1] ?? null,
            'ap_mat' => $row[2] ?? null,
            'codigo_sis' => $row[3] ?? null,
        ];

        if (isset($row[4]) && !empty($row[4])) {
            $data['correo'] = $row[4];
        }

        if (isset($row[5]) && !empty($row[5])) {
            $data['contrasenia'] = bcrypt($row[5]);
        }

        return new Estudiante($data);
    }
}
