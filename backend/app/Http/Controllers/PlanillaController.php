<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PlanillaController extends Controller
{
    // Mostrar los sprints asociados a la empresa del representante legal autenticado
    public function mostrarSprints()
    {
        // Obtener el representante legal autenticado
        $representante = auth()->guard('sanctum')->user();

        // Obtener los sprints asociados a la empresa del representante
        $sprints = Sprint::whereHas('planificacion.empresa', function ($query) use ($representante) {
            $query->where('id_empresa', $representante->id_empresa);
        })->get();

        return response()->json($sprints);
    }

    // Mostrar las tareas de un sprint seleccionado
    public function mostrarTareas($sprintId)
    {
        // Verificar si el sprint pertenece a la empresa del representante legal autenticado
        $representante = auth()->guard('sanctum')->user();
        $sprint = Sprint::where('id_sprint', $sprintId)
                        ->whereHas('planificacion.empresa', function ($query) use ($representante) {
                            $query->where('id_empresa', $representante->id_empresa);
                        })->firstOrFail();
        // Obtener las tareas del sprint con los responsables (estudiantes)
        $tareas = Tarea::whereIn('id_alcance', $sprint->alcances->pluck('id_alcance'))
                       ->with('estudiantes') 
                       ->get();
        return response()->json($tareas);
    }

    // 3. Asignar estudiantes a una tarea (solo dentro del rango de fechas del sprint)
    public function asignarEstudiantes(Request $request, $tareaId)
    {
        // Obtener el representante legal autenticado
        $representante = auth()->guard('sanctum')->user();

        // Obtener la tarea y verificar si pertenece a la empresa del representante legal
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('alcance.sprint.planificacion.empresa', function ($query) use ($representante) {
                          $query->where('id_empresa', $representante->id_empresa);
                      })
                      ->firstOrFail();

        // Obtener el sprint relacionado con la tarea
        $sprint = $tarea->alcance->sprint;

        // Verificar si la fecha actual está dentro del rango del sprint
        //$fechaActual = Carbon::now();
        //if ($fechaActual->lt($sprint->fecha_inicio) || $fechaActual->gt($sprint->fecha_fin)) {
        //    return response()->json(['error' => 'No se puede asignar estudiantes fuera del rango de fechas del sprint'], 403);
        //}

        // Obtener los IDs de los estudiantes a asignar
        $estudiantesIds = $request->input('estudiantes_ids');
        if (!$estudiantesIds) {
            return response()->json(['error' => 'Debe proporcionar al menos un estudiante para asignar a la tarea.'], 400);
        }

        // Asignar los estudiantes a la tarea sin quitar los anteriores (usando syncWithoutDetaching)
        $tarea->estudiantes()->sync($estudiantesIds);

        return response()->json(['message' => 'Estudiantes asignados correctamente']);
    }

    // 4. Eliminar un estudiante de una tarea (solo dentro del rango de fechas del sprint)
    public function eliminarEstudianteDeTarea($tareaId, $estudianteId)
    {
        // Obtener el representante legal autenticado
        $representante = auth()->guard('sanctum')->user();

        // Obtener la tarea y verificar si pertenece a la empresa del representante legal
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('alcance.sprint.planificacion.empresa', function ($query) use ($representante) {
                          $query->where('id_empresa', $representante->id_empresa);
                      })
                      ->firstOrFail();

        // Obtener el sprint relacionado con la tarea
        $sprint = $tarea->alcance->sprint;

        // Verificar si la fecha actual está dentro del rango del sprint
        $fechaActual = Carbon::now();
        if ($fechaActual->lt($sprint->fecha_inicio) || $fechaActual->gt($sprint->fecha_fin)) {
            return response()->json(['error' => 'No se puede eliminar estudiantes fuera del rango de fechas del sprint'], 403);
        }

        // Verificar si el estudiante está asignado a la tarea
        if (!$tarea->estudiantes()->where('id_estudiante', $estudianteId)->exists()) {
            return response()->json(['error' => 'El estudiante no está asignado a esta tarea.'], 404);
        }

        // Eliminar al estudiante de la tarea
        $tarea->estudiantes()->detach($estudianteId);

        return response()->json(['message' => 'Estudiante eliminado correctamente de la tarea.']);
    }
}