<?php

namespace App\Http\Controllers;

use App\Imports\EstudiantesImport;
use App\Models\Estudiante;
use App\Models\RepresentateLegal;
use App\Notifications\EstudianteRegistered;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;

class EstudianteController extends Controller
{
    // Mostrar todos los estudiantes
    public function index()
    {
        try {
            $estudiantes = Estudiante::all();
            return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los estudiantes'], 500);
        }
    }

    public function listaEstudiantes()
    {
        try {
            // Obtener el estudiante autenticado
            $estudiante = auth()->guard('sanctum')->user();
            $sprintId = request('sprintId');

            // Verificar si el estudiante tiene asignada una empresa
            if (!$estudiante || !$estudiante->id_empresa) {
                return response()->json(['error' => 'No se encontró empresa para este estudiante'], 404);
            }

            // Listar los estudiantes que pertenecen a la misma empresa
            $estudiantes = Estudiante::where('id_empresa', $estudiante->id_empresa)
                ->with(['evaluadoEvaluacionesFinales' => function ($query) use ($estudiante) {
                    $query->where('id_est_evaluador', $estudiante->id_estudiante);
                }])
                ->with(['evaluadoCriterios' => function ($query) use ($estudiante, $sprintId) {
                    $query->where('id_estudiante_evaluador', $estudiante->id_estudiante)
                    ->when(isset($sprintId), fn ($q) => $q->where('id_sprint', $sprintId));
                }])
                ->get();

            return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los estudiantes'], 500);
        }
    }


    // Mostrar un estudiante específico
    public function show($id)
    {
        try {
            $estudiante = Estudiante::where('id_estudiante', $id)->first();
            return response()->json($estudiante, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        }
    }

    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        // Validar los datos
        $validator = Validator::make($request->all(), [
            'nombre_estudiante' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'ap_pat' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'ap_mat' => [
                'nullable',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'codigo_sis' => 'required|digits:9|unique:estudiante,codigo_sis',
            'es_representante' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $docente = auth()->guard('sanctum')->user();
        $validatedData = $validator->validated();
        $validatedData['ap_mat'] = $validatedData['ap_mat'] ?? ' ';
        $representanteId = null;
        $correo = $request->codigo_sis . '@est.umss.edu';
        $contrasenia = Str::random(10);
        // Si se indica que el estudiante es un representante, crear un nuevo representante
        if ($request->es_representante) {
            $representante = RepresentateLegal::create([
                'estado' => 1, // Puedes ajustar el estado según sea necesario
            ]);
            $representanteId = $representante->id_representante; // Obtener el ID del representante recién creado
            // Crear el estudiante, asignando el ID del representante si existe
            $estudiante = Estudiante::create([
                'nombre_estudiante' => $request->nombre_estudiante,
                'ap_pat' => $request->ap_pat,
                'ap_mat' => $validatedData['ap_mat'],
                'codigo_sis' => $request->codigo_sis,
                'id_grupo' => $docente->id_grupo,
                'id_representante' => $representanteId, // Asignar el ID del representante
                'correo' => $correo,
                'contrasenia' => bcrypt($contrasenia), // Hashear la contraseña antes de almacenarla en la base de datos
            ]);
            Notification::route('mail', $correo)
                ->notify(new EstudianteRegistered($request->nombre_estudiante, $correo, $contrasenia));
        } else {
            // Crear el estudiante, asignando el ID del representante si existe
            $estudiante = Estudiante::create([
                'nombre_estudiante' => $request->nombre_estudiante,
                'ap_pat' => $request->ap_pat,
                'ap_mat' => $validatedData['ap_mat'],
                'codigo_sis' => $request->codigo_sis,
                'id_grupo' => $docente->id_grupo,
                'id_representante' => $representanteId, // Asignar el ID del representante
                'correo' => $correo,
                'contrasenia' => bcrypt($contrasenia), // Hashear la contraseña antes de almacenarla en la base de datos
            ]);
        }

        return response()->json($estudiante, 201); // Retornar el estudiante creado
    }



    // Actualizar un estudiante existente
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre_estudiante' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'ap_pat' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'ap_mat' => [
                'nullable',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'codigo_sis' => 'required|integer|unique:estudiante,codigo_sis,' . $id . ',id_estudiante',
            'es_representante' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $validatedData = $validator->validated();
        $validatedData['ap_mat'] = $validatedData['ap_mat'] ?? ' ';
        try {
            $estudiante = Estudiante::where('id_estudiante', $id)->first();
            $isRepresentante = $request->input('es_representante');
            if ($isRepresentante) {
                $contrasenia = Str::random(10);
                $estudiante->contrasenia = bcrypt($contrasenia);
            } else {
                $contrasenia = $estudiante->contrasenia;
            }

            $estudiante->update([
                'nombre_estudiante' => $request->input('nombre_estudiante'),
                'ap_pat' => $request->input('ap_pat'),
                'ap_mat' => $validatedData['ap_mat'],
                'codigo_sis' => $request->input('codigo_sis'),
                'id_representante' => $isRepresentante ? 1 : null, // Asignar 1 o null según es_representante
            ]);
            if ($isRepresentante) {
                Notification::route('mail', $estudiante->correo)
                    ->notify(new EstudianteRegistered($estudiante->nombre_estudiante, $estudiante->correo, $contrasenia));
            }

            return response()->json($estudiante, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el estudiante'], 500);
        }
    }


    // Eliminar un estudiante y su representante
    public function destroy($id)
    {
        try {
            $estudiante = Estudiante::findOrFail($id);

            // Eliminar el estudiante
            $estudiante->delete();

            return response()->json(['message' => 'Estudiante y su representante eliminado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el estudiante'], 500);
        }
    }


    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        try {
            Excel::import(new EstudiantesImport, $request->file('file'));
            $estudiantes = Estudiante::all();
            return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al importar estudiantes: ' . $e->getMessage()], 500);
        }
    }
}
