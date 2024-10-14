<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Tarea;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanillaController extends Controller
{
    public function mostrarSprints()
    {
        // Obtener los sprints asociados a la empresa del representante legal autenticado
        $representante = Auth::user();
        $sprints = Sprint::whereHas('planificacion.empresa', function($query) use ($representante) {
            $query->where('id_empresa', $representante->id_empresa);
        })->get();

        return response()->json($sprints);
    }

    public function mostrarTareas($sprintId)
    {
        // Verificar si el sprint pertenece a la empresa del representante
        $representante = Auth::user();
        $sprint = Sprint::where('id_sprint', $sprintId)
                        ->whereHas('planificacion.empresa', function($query) use ($representante) {
                            $query->where('id_empresa', $representante->id_empresa);
                        })->firstOrFail();

        // Obtener tareas del sprint
        $tareas = Tarea::whereIn('id_alcance', $sprint->alcances->pluck('id_alcance'))->with('estudiantes')->get();
        return response()->json($tareas);
    }

    public function asignarEstudiante(Request $request, $tareaId)
    {
        $representante = Auth::user();
        $tarea = Tarea::findOrFail($tareaId);

        // Verificar si la tarea pertenece a la empresa del representante
        $sprint = Sprint::whereHas('alcances.tareas', function($query) use ($tarea) {
            $query->where('id_tarea', $tarea->id_tarea);
        })->whereHas('planificacion.empresa', function($query) use ($representante) {
            $query->where('id_empresa', $representante->id_empresa);
        })->firstOrFail();

        // Verificar si la fecha actual está dentro del rango del sprint
        if (now()->lt($sprint->fecha_inicio) || now()->gt($sprint->fecha_fin)) {
            return response()->json(['error' => 'Fuera del rango de fechas permitidas'], 403);
        }

        // Asignar estudiantes a la tarea
        $estudiantesIds = $request->input('estudiantes_ids');
        foreach ($estudiantesIds as $estudianteId) {
            // Utilizar el modelo EstudianteTarea para manejar la relación
            $tarea->estudiantes()->syncWithoutDetaching($estudianteId);
        }

        return response()->json(['message' => 'Estudiantes asignados correctamente']);
    }

    public function eliminarEstudiante($tareaId, $estudianteId)
    {
        $representante = Auth::user();
        $tarea = Tarea::findOrFail($tareaId);

        // Verificar si la tarea pertenece a la empresa del representante
        $sprint = Sprint::whereHas('alcances.tareas', function($query) use ($tarea) {
            $query->where('id_tarea', $tarea->id_tarea);
        })->whereHas('planificacion.empresa', function($query) use ($representante) {
            $query->where('id_empresa', $representante->id_empresa);
        })->firstOrFail();

        // Verificar si la fecha actual está dentro del rango del sprint
        if (now()->lt($sprint->fecha_inicio) || now()->gt($sprint->fecha_fin)) {
            return response()->json(['error' => 'Fuera del rango de fechas permitidas'], 403);
        }

        // Eliminar estudiante de la tarea usando detach
        $tarea->estudiantes()->detach($estudianteId);

        return response()->json(['message' => 'Estudiante eliminado correctamente']);
    }

    public function actualizarTarea(Request $request, $tareaId)
    {
        $representante = Auth::user();
        $tarea = Tarea::findOrFail($tareaId);

        // Verificar si la tarea pertenece a la empresa del representante
        $sprint = Sprint::whereHas('alcances.tareas', function($query) use ($tarea) {
            $query->where('id_tarea', $tarea->id_tarea);
        })->whereHas('planificacion.empresa', function($query) use ($representante) {
            $query->where('id_empresa', $representante->id_empresa);
        })->firstOrFail();

        // Actualizar progreso y estado de la tarea
        $tarea->progreso = $request->input('progreso');
        $tarea->estado = $request->input('estado');
        $tarea->save();

        return response()->json(['message' => 'Tarea actualizada correctamente']);
    }
}