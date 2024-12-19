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
        $request->validate([
            'sprint_id' => 'required|exists:sprint,id_sprint'
        ]);

        $sprint = Sprint::findOrFail($request->sprint_id);
        $porcentajeMaximo = $sprint->porcentaje;

        $sprintWeeks = json_decode($sprint->revisado_semanas, true) ?? [];
        if (in_array((int)$request->week, $sprintWeeks)) {
            return response()->json(['error' => 'Esta semana ya ha sido revisada y no se puede modificar.'], 422);
        }

        // Validación de datos de entrada
        $request->validate([
            'tareas' => 'required|array',
            'tareas.*.id_tarea' => 'required|exists:tarea,id_tarea',
            'tareas.*.calificacion' => [
                'required',
                'integer',
                'min:1',
                'max:' . $porcentajeMaximo
            ],
            'tareas.*.comments' => 'nullable|string',
            'tareas.*.revisado' => 'required|boolean',
            'sprint_id' => 'required|exists:sprint,id_sprint',
            'week' => 'required|integer|min:1',
            'week_revisado' => 'required|boolean'
        ]);

        // Obtenemos de nuevo el sprint (opcional, ya lo tenemos arriba)
        $sprint = Sprint::findOrFail($request->sprint_id);
        $porcentajeMaximo = $sprint->porcentaje;

        try {
            DB::beginTransaction();

            foreach ($request->tareas as $tareaData) {
                $calificacion = (int) $tareaData['calificacion'];

                // Validar que la calificación no exceda el porcentaje máximo
                if ($calificacion > $porcentajeMaximo) {
                    return response()->json([
                        'error' => "La calificación no puede exceder el valor máximo permitido del sprint: $porcentajeMaximo"
                    ], 422);
                }

                $tarea = Tarea::findOrFail($tareaData['id_tarea']);
                $tarea->calificacion = $calificacion;
                $tarea->observaciones = $tareaData['comments'] ?? null;
                $tarea->revisado = $tareaData['revisado'];
                $tarea->save();

                $estudiantes = EstudianteTarea::where('id_tarea', $tarea->id_tarea)->with('estudiante')->get();
                foreach ($estudiantes as $estudianteTarea) {
                    DetalleTarea::updateOrCreate(
                        ['id_tarea' => $tarea->id_tarea, 'semana_sprint' => $request->week],
                        [
                            'nom_estudiante' => $estudianteTarea->estudiante->nombre_estudiante,
                            'nom_tarea' => $tarea->nombre_tarea,
                            'calificacion_tarea' => "{$calificacion} / {$porcentajeMaximo}",
                            'observaciones_tarea' => $tareaData['comments'] ?? '',
                            'revisado_tarea' => $tareaData['revisado'],
                            'revisado_semanas' => $request->week_revisado
                        ]
                    );
                }
            }

            // Después de guardar todas las tareas, actualizar las semanas revisadas del sprint
            $sprintWeeks = json_decode($sprint->revisado_semanas, true) ?? [];
            if ($request->week_revisado && !in_array((int)$request->week, $sprintWeeks)) {
                $sprintWeeks[] = (int)$request->week;
                $sprint->revisado_semanas = json_encode($sprintWeeks);
                $sprint->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al guardar la evaluación: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Evaluación guardada con éxito.']);
    }



    // Obtener la evaluación de una semana que ya fue revisada
    public function getReviewedWeek($sprintId, $week)
    {
        $sprint = Sprint::findOrFail($sprintId);

        // Obtener las semanas revisadas del sprint
        $sprintWeeks = json_decode($sprint->revisado_semanas, true) ?? [];

        // Verificar si la semana está revisada
        if (!in_array((int)$week, $sprintWeeks)) {
            return response()->json(['message' => 'La semana no ha sido revisada aún.'], 404);
        }

        // Obtener las tareas de esa semana desde la tabla detalle_tarea
        $detalleTareas = DetalleTarea::where('semana_sprint', $week)
            ->whereHas('tarea.alcance.sprint', function ($query) use ($sprintId) {
                $query->where('id_sprint', $sprintId);
            })
            ->distinct()
            ->get();

        $responseData = $detalleTareas->map(function ($detalle) {
            return [
                'id_tarea' => $detalle->id_tarea,
                'nom_estudiante' => $detalle->nom_estudiante,
                'nom_tarea' => $detalle->nom_tarea,
                'calificacion_tarea' => $detalle->calificacion_tarea,
                'observaciones_tarea' => $detalle->observaciones_tarea,
                'revisado_tarea' => $detalle->revisado_tarea,
            ];
        });

        return response()->json($responseData);
    }
}
