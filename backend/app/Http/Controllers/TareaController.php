<?php

namespace App\Http\Controllers;

use App\Models\Alcance;
use App\Models\EstudianteTarea;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TareaController extends Controller
{
    public function mostrarSprints()
    {
        // Obtener el estudiante autenticado
        $estudiante = auth()->guard('sanctum')->user();

        // Obtener todos los sprints de la empresa a la que pertenece el estudiante
        $sprints = Sprint::whereHas('planificacion.empresa.estudiantes', function ($query) use ($estudiante) {
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
    $planificacion = Planificacion::where('id_empresa', $estudiante->id_empresa)->first();
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
        // Obtener el estudiante autenticado
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
        // Obtener el estudiante autenticado
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

    public function mostrarTarea($id)
    {
        // Obtener la tarea junto con los criterios asociados
        $tarea = Tarea::with('criterios')->find($id);

        if (!$tarea) {
            return response()->json(['error' => 'Tarea no encontrada'], 404);
        }

        return response()->json($tarea, 200);
    }

    public function mostrarTodasLasTareas($empresaId)
    {
        // Obtener el estudiante autenticado
        $estudiante = auth()->guard('sanctum')->user();

        if (!$estudiante) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar que la empresa existe
        $planificacion = Planificacion::where('id_empresa', $empresaId)->first();
        if (!$planificacion) {
            return response()->json(['error' => 'No se encontró la planificación para la empresa especificada'], 404);
        }

        // Obtener todos los sprints asociados a la planificación
        $sprints = Sprint::where('id_planificacion', $planificacion->id_planificacion)->get();

        if ($sprints->isEmpty()) {
            return response()->json(['error' => 'No se encontraron sprints para la empresa especificada'], 404);
        }

        // Obtener todos los alcances de los sprints
        $alcances = Alcance::whereIn('id_sprint', $sprints->pluck('id_sprint'))->get();
        if ($alcances->isEmpty()) {
            return response()->json(['error' => 'No se encontraron alcances para los sprints de la empresa especificada'], 404);
        }

        // Obtener todas las tareas de los alcances, incluyendo los estudiantes asignados
        $tareas = Tarea::whereIn('id_alcance', $alcances->pluck('id_alcance'))
            ->with('estudiantes') // Eager loading de estudiantes asignados
            ->get();

        if ($tareas->isEmpty()) {
            return response()->json(['error' => 'No se encontraron tareas para la empresa especificada'], 404);
        }

        return response()->json($tareas, 200);
    }
    public function getSprintsConTareas($equipoId)
    {
        try {
            // Obtener planificaciones asociadas al equipo
            $planificacion = Planificacion::where('id_empresa', $equipoId)->first();

            if (!$planificacion) {
                return response()->json(['message' => 'No se encontró planificación para este equipo'], 404);
            }

            // Obtener sprints asociados
            $sprints = Sprint::with('alcances.tareas.estudiantes')
                ->where('id_planificacion', $planificacion->id_planificacion)
                ->get();

            if ($sprints->isEmpty()) {
                return response()->json(['message' => 'No se encontraron sprints para este equipo'], 404);
            }

            return response()->json($sprints, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener sprints y tareas: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener los sprints'], 500);
        }
    }
}
