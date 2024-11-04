<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Docente;
use App\Models\Empresa;
use App\Models\Sprint;
use App\Models\Tarea;
use App\Models\DetalleTarea;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EvaluacionController extends Controller
{
    // Método para mostrar el formulario de evaluación
    public function showEvaluationForm()
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener todas las empresas del grupo del docente
        $empresas = Empresa::whereHas('grupos', function ($query) use ($docente) {
            $query->where('id_docente', $docente->id_docente);
        })->distinct()->get();        

        return view('evaluation.form', compact('empresas'));
    }

    // Método para obtener los sprints de una empresa seleccionada
    public function getSprintsByEmpresa($empresaId)
    {
        $sprints = Sprint::whereIn('id_planificacion', function ($query) use ($empresaId) {
            $query->select('id_planificacion')
                ->from('planificacion')
                ->where('id_empresa', $empresaId);
        })->get();
        
        return response()->json($sprints);
    }

    // Método para obtener las semanas de un sprint seleccionado
    public function getWeeksBySprint($sprintId)
    {
        $sprint = Sprint::findOrFail($sprintId);
        $weeks = range(1, $sprint->semanas_cant);

        return response()->json($weeks);
    }

    // Método para obtener las tareas de una empresa seleccionada
    public function getTareasByEmpresa($empresaId)
    {
        // Filtrar las tareas de la empresa que tengan estado pendiente, en progreso o terminado (sin revisar)
        $tareas = Tarea::whereIn('id_alcance', function ($query) use ($empresaId) {
            $query->select('id_alcance')
                ->from('alcance')
                ->whereHas('sprint.planificacion', function ($query) use ($empresaId) {
                    $query->where('id_empresa', $empresaId);
                });
        })->where(function ($query) {
            $query->whereIn('estado', ['Pendiente', 'En Progreso'])
                  ->orWhere(function ($query) {
                      $query->where('estado', 'Terminado')->where('revisado', false);
                  });
        })->get();        

        return response()->json($tareas);
    }

    // Método para guardar la evaluación de las tareas
    public function saveEvaluation(Request $request)
    {
        $request->validate([
            'tareas' => 'required|array',
            'tareas.*.id_tarea' => 'required|exists:tarea,id_tarea',
            'tareas.*.calificacion' => 'required|integer|min:1|max:100',
            'tareas.*.observaciones' => 'nullable|string',
            'tareas.*.revisado' => 'required|boolean',
            'sprint_id' => 'required|exists:sprint,id_sprint',
            'week' => 'required|integer|min:1',
            'week_revisado' => 'required|boolean'
        ]);

        DB::transaction(function () use ($request) {
            // Guardar la evaluación para cada tarea
            foreach ($request->tareas as $tareaData) {
                $tarea = Tarea::findOrFail($tareaData['id_tarea']);
                $tarea->calificacion = $tareaData['calificacion'];
                $tarea->observaciones = $tareaData['observaciones'] ?? null;
                $tarea->revisado = $tareaData['revisado'];
                $tarea->save();

                // Guardar en detalle tarea
                DetalleTarea::updateOrCreate(
                    ['id_tarea' => $tarea->id_tarea, 'semana_sprint' => $request->week],
                    [
                        'estado_tarea' => $tarea->estado,
                        'calificacion_tarea' => $tareaData['calificacion'],
                        'observaciones_tarea' => $tareaData['observaciones'] ?? '',
                        'revisado_tarea' => $tareaData['revisado'],
                        'nom_tarea' => $tarea->nombre_tarea
                    ]
                );                
            }

            // Marcar la semana como revisada si corresponde
            $sprint = Sprint::findOrFail($request->sprint_id);
            $sprintWeeks = json_decode($sprint->revisado_semanas, true) ?: [];
            if ($request->week_revisado && !in_array($request->week, $sprintWeeks, true)) {
                $sprintWeeks[] = $request->week;
                $sprint->revisado_semanas = json_encode($sprintWeeks);
                $sprint->save();
            }
        });

        return response()->json(['message' => 'Evaluación guardada con éxito.']);
    }

    // Método para obtener la evaluación de una semana que ya fue revisada
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
