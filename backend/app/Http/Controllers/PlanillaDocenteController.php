<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanillaDocenteController extends Controller
{
    public function mostrarEmpresas()
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener las empresas asociadas a los grupos que el docente tiene asignados
        $empresas = Empresa::whereHas('grupos', function($query) use ($docente) {
            $query->where('id_docente', $docente->id_docente);
        })->get();

        return response()->json($empresas);
    }

    public function mostrarSprints($empresaId)
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Verificar que la empresa pertenece a un grupo del docente
        $empresa = Empresa::where('id_empresa', $empresaId)
                          ->whereHas('grupos', function($query) use ($docente) {
                              $query->where('id_docente', $docente->id_docente);
                          })->firstOrFail();

        // Obtener los sprints de la empresa
        $sprints = Sprint::where('id_planificacion', $empresa->planificacion->id_planificacion)->get();

        return response()->json($sprints);
    }

    public function mostrarTareas($sprintId)
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener tareas del sprint seleccionado
        $sprint = Sprint::where('id_sprint', $sprintId)
                        ->whereHas('planificacion.empresa.grupos', function($query) use ($docente) {
                            $query->where('id_docente', $docente->id_docente);
                        })->firstOrFail();

        // Obtener las tareas del sprint
        $tareas = Tarea::whereIn('id_alcance', $sprint->alcances->pluck('id_alcance'))->with('estudiantes')->get();

        // Añadir el símbolo de porcentaje al progreso
        foreach ($tareas as $tarea) {
            $tarea->progreso = $tarea->progreso . ' %';
        }

        return response()->json($tareas);
    }

    public function actualizarProgreso(Request $request, $tareaId)
    {
        // Validar la solicitud
        $request->validate([
            'progreso' => 'required|in:0,20,40,60,80,100'
        ]);

        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener la tarea y verificar que pertenece al grupo del docente
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('alcance.sprint.planificacion.empresa.grupos', function($query) use ($docente) {
                          $query->where('id_docente', $docente->id_docente);
                      })->firstOrFail();

        // Verificar que la fecha actual está dentro del rango del sprint
        $sprint = $tarea->alcance->sprint;
        if (now()->lt($sprint->fecha_inicio) || now()->gt($sprint->fecha_fin)) {
            return response()->json(['error' => 'Fuera del rango de fechas permitidas del sprint'], 403);
        }

        // Actualizar el progreso de la tarea
        $tarea->progreso = $request->input('progreso');

        // Actualizar el estado de la tarea en base al progreso
        if ($tarea->progreso == 0) {
            $tarea->estado = 'Pendiente';
        } elseif ($tarea->progreso > 0 && $tarea->progreso < 100) {
            $tarea->estado = 'En progreso';
        } elseif ($tarea->progreso == 100) {
            $tarea->estado = 'Terminado';
        }

        $tarea->save();

        return response()->json(['message' => 'Progreso de la tarea actualizado correctamente']);
    }

    public function verAvances($tareaId)
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener la tarea y verificar que pertenece al grupo del docente
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('alcance.sprint.planificacion.empresa.grupos', function($query) use ($docente) {
                          $query->where('id_docente', $docente->id_docente);
                      })->firstOrFail();

        // Obtener la lista de avances
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];

        return response()->json($avances);
    }
}
