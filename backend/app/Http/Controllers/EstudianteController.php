<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Imports\EstudiantesImport;
use App\Models\Estudiante;
use App\Models\RepresentateLegal;
use App\Notifications\EstudianteRegistered;
use App\Models\Autoevaluacion;
use App\Models\Pare;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Notification;


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

            // Verificar si el estudiante tiene asignada una empresa
            if (!$estudiante || !$estudiante->id_empresa) {
                return response()->json(['error' => 'No se encontró empresa para este estudiante'], 404);
            }

            // Listar los estudiantes que pertenecen a la misma empresa
            $estudiantes = Estudiante::where('id_empresa', $estudiante->id_empresa)
                ->with(['evaluadoEvaluacionesFinales' => function ($query) use ($estudiante) {
                    $query->where('id_est_evaluador', $estudiante->id_estudiante);
                }])
                ->with(['evaluadoCriterios' => function ($query) use ($estudiante) {
                    $query->where('id_estudiante_evaluador', $estudiante->id_estudiante);
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
        $validatedData = $request->validate([
            'nombre_estudiante' => 'required|string|max:255',
            'ap_pat' => 'required|string|max:255',
            'ap_mat' => 'nullable|string|max:255',
            'codigo_sis' => 'required|digits:9|unique:estudiante,codigo_sis', // Asegúrate de usar el nombre correcto de la tabla
            'es_representante' => 'boolean',
        ]);

        $representanteId = null;
        $correo = $validatedData['codigo_sis'] . '@est.umss.edu';
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
                'ap_mat' => $request->ap_mat,
                'codigo_sis' => $request->codigo_sis,
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
                'ap_mat' => $request->ap_mat,
                'codigo_sis' => $request->codigo_sis,
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
        $this->validate($request, [
            'nombre_estudiante' => 'required|string|max:255',
            'ap_pat' => 'required|string|max:255',
            'ap_mat' => 'nullable|string|max:255',
            'codigo_sis' => 'required|integer|unique:estudiante,codigo_sis,' . $id . ',id_estudiante',
            'es_representante' => 'boolean', // Validación para es_representante
        ]);

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
                'ap_mat' => $request->input('ap_mat'),
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


    public function getStudentReport($id_estudiante)
    {
        try {
            // Cargar relaciones válidas
            $estudiante = Estudiante::with([
                'empresa',
                'tareas',
                'evaluadorEvaluacionesFinales',
                'evaluadoEvaluacionesFinales',
            ])->findOrFail($id_estudiante);

            // Obtener detalles de autoevaluación
            $autoevaluaciones = Autoevaluacion::with('detalle_autos')
                ->whereHas('evaluacion', function ($query) use ($id_estudiante) {
                    // Ajusta esta condición según cómo esté relacionada la evaluación con el estudiante
                    $query->where('id_estudiante', $id_estudiante);
                })->get();

            // Obtener detalles de evaluación de pares
            $evaluacionesPares = Pare::with('detalle_pars')
                ->whereHas('evaluacion', function ($query) use ($id_estudiante) {
                    // Ajusta esta condición según cómo esté relacionada la evaluación con el estudiante
                    $query->where('id_estudiante', $id_estudiante);
                })->get();

            // Estructurar la respuesta
            return response()->json([
                'estudiante' => [
                    'id_estudiante' => $estudiante->id_estudiante,
                    'nombre' => $estudiante->nombre_estudiante,
                    'ap_pat' => $estudiante->ap_pat,
                    'ap_mat' => $estudiante->ap_mat,
                    'codigo_sis' => $estudiante->codigo_sis,
                    'correo' => $estudiante->correo,
                    'empresa' => $estudiante->empresa ? [
                        'id_empresa' => $estudiante->empresa->id_empresa,
                        'nombre_empresa' => $estudiante->empresa->nombre_empresa,
                    ] : null,
                    'tareas' => $estudiante->tareas->map(function ($tarea) {
                        return [
                            'id_tarea' => $tarea->id_tarea,
                            'nombre_tarea' => $tarea->nombre_tarea,
                            'estimacion' => $tarea->estimacion,
                            'estado' => $tarea->estado,
                            'resultado_evaluacion' => $tarea->pivot->resultado_evaluacion ?? null,
                            'descripcion_evaluacion' => $tarea->pivot->descripcion_evaluacion ?? null,
                        ];
                    }),
                    'evaluaciones' => [
                        'autoevaluaciones' => $autoevaluaciones->map(function ($autoevaluacion) {
                            return [
                                'id_autoe' => $autoevaluacion->id_autoe,
                                'detalles' => $autoevaluacion->detalle_autos->map(function ($detalle) {
                                    return [
                                        'criterio' => $detalle->criterio,
                                        'nota' => $detalle->nota,
                                    ];
                                }),
                            ];
                        }),
                        'evaluaciones_pares' => $evaluacionesPares->map(function ($pares) {
                            return [
                                'id_pares' => $pares->id_pares,
                                'detalles' => $pares->detalle_pars->map(function ($detalle) {
                                    return [
                                        'criterio' => $detalle->criterio,
                                        'nota' => $detalle->nota,
                                    ];
                                }),
                            ];
                        }),
                        'evaluaciones_docente' => $estudiante->evaluadoEvaluacionesFinales->map(function ($evaluacion) {
                            return [
                                'id_evaluacion' => $evaluacion->id_evaluacion,
                                'nota' => $evaluacion->nota,
                                'comentario' => $evaluacion->comentario,
                            ];
                        }),
                    ],
                ],
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Error al obtener el reporte del estudiante: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al obtener el reporte del estudiante',
                'message' => $e->getMessage(), // Agrega el mensaje de error para depuración
            ], 500);
        }
    }

}





