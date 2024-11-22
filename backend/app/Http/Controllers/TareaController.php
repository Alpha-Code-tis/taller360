<?php

namespace App\Http\Controllers;

use App\Models\EstudianteTarea;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
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

        if (!$estudiante) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar que el sprint pertenece a la empresa del estudiante
        $planificacion = Planificacion::where('id_empresa',$estudiante->id_empresa)->first();
        $sprint = Sprint::where('id_sprint', $sprintId)
            ->where('id_planificacion', $planificacion->id_planificacion)
            ->first();
        if (!$sprint) {
            return response()->json(['error' => 'Sprint no encontrado o no pertenece a la empresa del estudiante'], 404);
        }
        $tareas = $estudiante->tareas()
                       ->whereIn('id_alcance', $sprint->alcances->pluck('id_alcance'))
                       ->get();

        return response()->json($tareas);
    }


    public function subirAvance(Request $request, $tareaId)
    {
        // Get the authenticated student
        $estudiante = auth()->guard('sanctum')->user();

        if (!$estudiante) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Validate the file
        $request->validate([
            'archivo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Verify that the task belongs to the student
        $tarea = Tarea::where('id_tarea', $tareaId)
            ->whereHas('estudiantes', function ($query) use ($estudiante) {
                $query->where('estudiantes.id_estudiante', $estudiante->id_estudiante);
            })
            ->firstOrFail();

        // Upload the file
        $path = $request->file('archivo')->store('public/avances');

        // Update the 'avances' attribute of the task
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];
        $avances[] = $path;
        $tarea->avances = implode(",", $avances);
        $tarea->save();

        return response()->json(['message' => 'Avance subido correctamente', 'path' => $path]);
    }

    public function verAvances($tareaId)
    {
        // Get the authenticated student
        $estudiante = auth()->guard('sanctum')->user();

        if (!$estudiante) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verify that the task belongs to the student
        $tarea = Tarea::where('id_tarea', $tareaId)
            ->whereHas('estudiantes', function ($query) use ($estudiante) {
                $query->where('estudiantes.id_estudiante', $estudiante->id_estudiante);
            })
            ->firstOrFail();

        // Get the list of avances
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];

        return response()->json($avances);
    }

    public function eliminarAvance($tareaId, $avanceIndex)
    {
        // Get the authenticated student
        $estudiante = auth()->guard('sanctum')->user();

        if (!$estudiante) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verify that the task belongs to the student
        $tarea = Tarea::where('id_tarea', $tareaId)
            ->whereHas('estudiantes', function ($query) use ($estudiante) {
                $query->where('estudiantes.id_estudiante', $estudiante->id_estudiante);
            })
            ->firstOrFail();

        // Get the list of avances
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];

        if (isset($avances[$avanceIndex])) {
            // Delete the file from storage
            Storage::delete($avances[$avanceIndex]);

            // Remove the avance from the array
            unset($avances[$avanceIndex]);

            // Reindex the array and update the database
            $avances = array_values($avances);
            $tarea->avances = implode(",", $avances);
            $tarea->save();

            return response()->json(['message' => 'Avance eliminado correctamente']);
        }

        return response()->json(['error' => 'Avance no encontrado'], 404);
    }
}
