<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Alcance;
use App\Models\Empresa;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanillaNotasFinalesController extends Controller
{
    public function getEquipos()
    {
        $docente = Auth::user();

        $empresas = Empresa::whereHas('grupos', function ($query) use ($docente) {
            $query->where('id_docente', $docente->id_docente);
        })->get();
        return response()->json($empresas);
    }

    public function getSprints($empresaId)
    {
        $sprints = Sprint::where('id_empresa', $empresaId)->get();
        return response()->json($sprints);
    }

    public function mostrarNotaEvaluacion($empresaId, $sprintId)
    {
        // Verificar que la empresa existe
        $planificacion = Planificacion::where('id_empresa', $empresaId)->first();
        if (!$planificacion) {
            return response()->json(['error' => 'No se encontró la planificación para la empresa especificada'], 404);
        }
        // Obtener el sprint específico asociado a la planificación
        $sprint = Sprint::where('id_planificacion', $planificacion->id_planificacion)
            ->where('id_sprint', $sprintId)
            ->first();
        if (!$sprint) {
            return response()->json(['error' => 'No se encontró el sprint especificado para la empresa'], 404);
        }
        // Obtener todos los alcances del sprint seleccionado
        $alcances = Alcance::where('id_sprint', $sprint->id_sprint)->get();
        if ($alcances->isEmpty()) {
            return response()->json(['error' => 'No se encontraron alcances para el sprint especificado'], 404);
        }
        // Obtener todas las tareas de los alcances del sprint, incluyendo los estudiantes asignados
        $tareas = Tarea::whereIn('id_alcance', $alcances->pluck('id_alcance'))
            ->with('estudiantes') // Eager loading de estudiantes asignados
            ->get();
        if ($tareas->isEmpty()) {
            return response()->json(['error' => 'No se encontraron tareas para el sprint especificado'], 404);
        }
        // Crear una estructura para almacenar las notas por estudiante
        $notasEstudiantes = [];
        // Recorrer todas las tareas para calcular las notas promedio de cada estudiante
        foreach ($tareas as $tarea) {
            foreach ($tarea->estudiantes as $estudiante) {
                if (!isset($notasEstudiantes[$estudiante->id_estudiante])) {
                    $notasEstudiantes[$estudiante->id_estudiante] = [
                        'nombre' => $estudiante->nombre,
                        'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                        'promedioNotas' => 0,
                        'totalTareas' => 0,
                    ];
                }
                // Sumar la calificación de la tarea actual al estudiante correspondiente
                $notasEstudiantes[$estudiante->id_estudiante]['promedioNotas'] += $tarea->calificion;
                $notasEstudiantes[$estudiante->id_estudiante]['totalTareas']++;
            }
        }
        // Calcular el promedio final de cada estudiante
        foreach ($notasEstudiantes as &$estudianteData) {
            if ($estudianteData['totalTareas'] > 0) {
                $estudianteData['promedioNotas'] = $estudianteData['promedioNotas'] / $estudianteData['totalTareas'];
            }
        }
        // Devolver la respuesta con las notas promedio por cada estudiante
        return response()->json(array_values($notasEstudiantes), 200);
    }

}
