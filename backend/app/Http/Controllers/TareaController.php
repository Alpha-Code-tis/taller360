<?php

// app/Http/Controllers/TareaController.php
namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Tarea;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TareaController extends Controller
{
    public function mostrarSprints()
    {
        // Obtener el estudiante autenticado
        $estudiante = auth()->guard('sanctum')->user();

        // Obtener todos los sprints de la empresa a la que pertenece el estudiante
        $sprints = Sprint::whereHas('planificacion.empresa.estudiantes', function($query) use ($estudiante) {
            $query->where('id_estudiante', $estudiante->id_estudiante);
        })->get();

        return response()->json($sprints);
    }

    public function mostrarTareas($sprintId)
    {
        // Obtener el estudiante autenticado
        $estudiante = auth()->guard('sanctum')->user();

        // Verificar que el sprint pertenece a la empresa del estudiante
        $sprint = Sprint::where('id_sprint', $sprintId)
                        ->whereHas('planificacion.empresa.estudiantes', function($query) use ($estudiante) {
                            $query->where('id_estudiante', $estudiante->id_estudiante);
                        })->firstOrFail();

        // Obtener tareas del sprint que tienen asignado al estudiante
        $tareas = $estudiante->tareas()
                       ->whereIn('id_alcance', $sprint->alcances->pluck('id_alcance'))
                       ->get();

        return response()->json($tareas);
    }

    public function subirAvance(Request $request, $tareaId)
    {
        // Obtener el estudiante autenticado
        $estudiante = Auth::user();

        // Validar que el archivo es requerido y es una imagen
        $request->validate([
            'archivo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Verificar que la tarea pertenece al estudiante
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('estudiantes', function($query) use ($estudiante) {
                          $query->where('id_estudiante', $estudiante->id_estudiante);
                      })->firstOrFail();

        // Subir el archivo al almacenamiento
        $path = $request->file('archivo')->store('avances');

        // Guardar la referencia del avance en la tarea
        $tarea->avances = $tarea->avances ? $tarea->avances . "," . $path : $path;
        $tarea->save();

        return response()->json(['message' => 'Avance subido correctamente', 'path' => $path]);
    }

    public function verAvances($tareaId)
    {
        // Obtener el estudiante autenticado
        $estudiante = Auth::user();

        // Verificar que la tarea pertenece al estudiante
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('estudiantes', function($query) use ($estudiante) {
                          $query->where('id_estudiante', $estudiante->id_estudiante);
                      })->firstOrFail();

        // Obtener la lista de avances
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];

        return response()->json($avances);
    }

    public function eliminarAvance($tareaId, $avanceId)
    {
        // Obtener el estudiante autenticado
        $estudiante = Auth::user();

        // Verificar que la tarea pertenece al estudiante
        $tarea = Tarea::where('id_tarea', $tareaId)
                      ->whereHas('estudiantes', function($query) use ($estudiante) {
                          $query->where('id_estudiante', $estudiante->id_estudiante);
                      })->firstOrFail();

        // Obtener la lista de avances y eliminar el específico
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];
        if (isset($avances[$avanceId])) {
            // Eliminar el archivo del almacenamiento
            Storage::delete($avances[$avanceId]);
            unset($avances[$avanceId]);

            // Actualizar los avances de la tarea
            $tarea->avances = implode(",", $avances);
            $tarea->save();

            return response()->json(['message' => 'Avance eliminado correctamente']);
        }

        return response()->json(['error' => 'Avance no encontrado'], 404);
    }
}
