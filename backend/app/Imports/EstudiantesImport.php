<?php

namespace App\Imports;

use App\Models\Estudiante;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Notification;
use App\Notifications\EstudianteRegistered; // Asegúrate de importar la notificación

class EstudiantesImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        DB::beginTransaction();
        try {
            $validator = Validator::make($row, [
                'nombre_estudiante' => ['required','string','min:3','max:255','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u',
                ],
                'ap_pat' => ['required','string','min:3','max:255','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u',
                ],
                'ap_mat' => ['nullable','string','min:3','max:255','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u',
                ],
                'codigo_sis' => ['required','digits:9','unique:estudiante,codigo_sis','regex:/^(20[0-9]{2})([0-9]{5})$/',
                    function ($attribute, $value, $fail) {
                        $year = (int) substr($value, 0, 4);
                        if ($year < 2000 || $year > date('Y')) {
                            $fail("El $attribute debe comenzar con un año entre 2000 y " . date('Y') . ".");
                        }
                    },
                ],
                'correo' => 'nullable|email',
                'es_representante' => 'boolean',
            ]);
            if ($validator->fails()) {
                throw new \Exception("Error en la fila: " . implode(", ", $validator->errors()->all()));
            }
            $docente = auth()->guard('sanctum')->user();
            $data = [
                'nombre_estudiante' => $row['nombre_estudiante'],
                'ap_pat' => $row['ap_pat'] ?? null,
                'ap_mat' => $row['ap_mat'] ?? null,
                'id_grupo' => $docente->id_grupo,
                'codigo_sis' => $row['codigo_sis'],
            ];
            if (isset($row['correo']) && !empty($row['correo'])) {
                $data['correo'] = $row['correo'];
            }
            if (isset($row['contrasenia']) && !empty($row['contrasenia'])) {
                $data['contrasenia'] = bcrypt($row['contrasenia']);
            } else {
                $data['contrasenia'] = bcrypt('defaultPassword'); // Generar contraseña por defecto
            }
            $estudiante = Estudiante::create($data);
            Notification::route('mail', $data['correo'] ?? '')->notify(new EstudianteRegistered(
                $data['nombre_estudiante'], 
                $data['correo'] ?? 'Correo no especificado', 
                $row['contrasenia'] ?? 'defaultPassword'
            ));
            DB::commit();
            return $estudiante;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
