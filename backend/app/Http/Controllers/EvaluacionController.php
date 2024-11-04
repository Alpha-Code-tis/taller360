<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Docente;
use App\Models\Empresa;
use App\Models\Sprint;
use App\Models\Tarea;
use App\Models\DetalleTarea;
use App\Models\Estudiante;
use App\Models\EstudianteTarea;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EvaluacionController extends Controller
{
    // Mostrar el formulario de evaluación
    public function showEvaluationForm()
    {
        // Obtener el docente autenticado
        $docente = Auth::user();
        // Verificar si el docente está autenticado
        if (!$docente) {
            return response()->json([
                'error' => 'Docente no autenticado.'
            ], 401);
        }

        $empresas = Estudiante::whereNotNull('id_empresa')
            ->whereNotNull('id_representante')
            ->where('id_grupo', $docente->id_grupo)
            ->pluck('id_empresa')
            ->unique();

        // Verificar si hay empresas asociadas
        if ($empresas->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron empresas para este docente.'
            ], 404);
        }
        $detallesEmpresas = Empresa::whereIn('id_empresa', $empresas)->get();

        // Retornar las empresas en formato JSON
        return response()->json([
            'empresas' => $detallesEmpresas
        ]);
    }

    // Obtener los sprints de una empresa seleccionada
    public function getSprintsByEmpresa($empresaId)
    {
        $sprints = Sprint::whereIn('id_planificacion', function ($query) use ($empresaId) {
            $query->select('id_planificacion')
                ->from('planificacion')
                ->where('id_empresa', $empresaId);
        })->get();

        return response()->json($sprints);
    }
    public function getSprintPercentage($sprintId)
    {
        try {
            // Encuentra el sprint por ID
            $sprint = Sprint::findOrFail($sprintId);

            // Retornar el porcentaje del sprint
            return response()->json([
                'porcentaje' => $sprint->porcentaje
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Sprint no encontrado.'], 404);
        }
    }
    // Obtener las semanas de un sprint seleccionado
    public function getWeeksBySprint($sprintId)
    {
        $sprint = Sprint::findOrFail($sprintId);
        $weeks = range(1, $sprint->semanas_cant);

        return response()->json($weeks);
    }

    // Obtener las tareas de una empresa seleccionada
    public function getTareasByEmpresa($empresaId, $sprintId)
    {
        // Filtrar las tareas de la empresa seleccionada y sprint seleccionado
        $tareas = Tarea::whereHas('alcance', function ($query) use ($empresaId, $sprintId) {
            $query->whereHas('sprint', function ($query) use ($empresaId, $sprintId) {
                $query->where('id_sprint', $sprintId) // Filtrar por el sprint seleccionado
                    ->whereHas('planificacion', function ($query) use ($empresaId) {
                        $query->where('id_empresa', $empresaId); // Filtrar por la empresa seleccionada
                    });
            });
        })->where(function ($query) {
            $query->whereIn('estado', ['Pendiente', 'En Progreso'])
                ->orWhere(function ($query) {
                    $query->where('estado', 'Terminado')->where('revisado', false);
                });
        })->get();

        // Agregar los nombres de los responsables (estudiantes) para cada tarea
        $tareasConResponsables = $tareas->map(function ($tarea) {
            $responsables = EstudianteTarea::where('id_tarea', $tarea->id_tarea)
                ->with('estudiante')
                ->get()
                ->pluck('estudiante.nombre_estudiante')
                ->implode(', ');
            $tarea->responsables = $responsables;
            return $tarea;
        });

        return response()->json($tareasConResponsables);
    }


    // Guardar la evaluación de las tareas
    public function saveEvaluation(Request $request)
    {
        // Validación de datos de entrada
        $request->validate([
            'tareas' => 'required|array',
            'tareas.*.id_tarea' => 'required|exists:tarea,id_tarea',
            'tareas.*.calificacion' => ['required', 'regex:/^\d+ \/ \d+$/'],
            'tareas.*.observaciones' => 'nullable|string',
            'tareas.*.revisado' => 'required|boolean',
            'sprint_id' => 'required|exists:sprint,id_sprint',
            'week' => 'required|integer|min:1',
            'week_revisado' => 'required|boolean'
        ]);
        // Obtener el sprint para verificar el porcentaje máximo permitido
        $sprint = Sprint::findOrFail($request->sprint_id);
        $porcentajeMaximo = $sprint->porcentaje;
     

        try {
            // Iniciar una transacción para asegurar la integridad de los datos
            DB::beginTransaction();

            // Iterar sobre cada tarea proporcionada
            foreach ($request->tareas as $tareaData) {
                // Obtener el valor de la calificación en formato 'numero / porcentaje'
                list($calificacion, $porcentaje) = explode(' / ', $tareaData['calificacion']);

                // Convertir calificación y porcentaje a enteros para la validación
                $calificacion = (int) $calificacion;
                $porcentaje = (int) $porcentaje;

                // Validar que el porcentaje ingresado coincida con el del sprint
                if ($porcentaje !== $porcentajeMaximo) {
                    return response()->json([
                        'error' => "El porcentaje especificado debe coincidir con el porcentaje del sprint: $porcentajeMaximo"
                    ], 422);
                }

                // Validar que la calificación no exceda el porcentaje máximo
                if ($calificacion > $porcentajeMaximo) {
                    return response()->json([
                        'error' => "La calificación no puede exceder el valor máximo permitido del sprint: $porcentajeMaximo"
                    ], 422);
                }

                // Encontrar la tarea y actualizar los datos
                $tarea = Tarea::findOrFail($tareaData['id_tarea']);
                $tarea->calificacion = $calificacion; // Asignar la calificación
                $tarea->observaciones = $tareaData['observaciones'] ?? null;
                $tarea->revisado = $tareaData['revisado'];
                $tarea->save();


                // Guardar en detalle tarea con nombre del estudiante responsable
                $estudiantes = EstudianteTarea::where('id_tarea', $tarea->id_tarea)->with('estudiante')->get();
                foreach ($estudiantes as $estudianteTarea) {
                    DetalleTarea::updateOrCreate(
                        ['id_tarea' => $tarea->id_tarea, 'semana_sprint' => $request->week],
                        [
                            'nom_estudiante' => $estudianteTarea->estudiante->nombre_estudiante,
                            'nom_tarea' => $tarea->nombre_tarea,
                            'calificacion_tarea' => "{$calificacion} / {$porcentajeMaximo}", // Guardar el formato completo
                            'observaciones_tarea' => $tareaData['observaciones'] ?? '',
                            'revisado_tarea' => $tareaData['revisado'],
                            'revisado_semanas' => $request->week_revisado
                        ]
                    );
                }
            }

    

            DB::commit();
        } catch (\Exception $e) {
            // Rollback en caso de cualquier error
            DB::rollBack();
            return response()->json(['error' => 'Error al guardar la evaluación: ' . $e->getMessage()], 500);
        }

        // Responder con un mensaje de éxito
        return response()->json(['message' => 'Evaluación guardada con éxito.']);
    }


    // Obtener la evaluación de una semana que ya fue revisada
    public function getReviewedWeek($sprintId, $week)
    {
        $sprint = Sprint::findOrFail($sprintId);
        $sprintWeeks = json_decode($sprint->revisado_semanas, true) ?? [];

        if (!in_array($week, $sprintWeeks)) {
            return response()->json(['message' => 'La semana no ha sido revisada aún.'], 404);
        }

        // Obtener las tareas de esa semana desde la tabla detalle tarea
        $detalleTareas = DetalleTarea::where('semana_sprint', $week)
            ->whereHas('tarea.alcance.sprint', function ($query) use ($sprintId) {
                $query->where('id_sprint', $sprintId);
            })->distinct()->get();
        return response()->json($detalleTareas);
    }
}
