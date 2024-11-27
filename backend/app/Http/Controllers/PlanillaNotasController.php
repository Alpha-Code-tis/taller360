<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Alcance;
use App\Models\Nota;
use App\Models\Empresa;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
use App\Models\NotasSprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PlanillaNotasController extends Controller
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

        // Obtener la evaluación docente del docente autenticado
        $docente = Auth::user();
        $nota = Nota::where('id_docente', $docente->id_docente)
            ->where('id_empresa', $empresaId)
            ->where('id_sprint', $sprint->id_sprint)
            ->first();

        if (!$nota) {
            return response()->json(['error' => 'No se encontró la nota para el docente en el sprint especificado'], 404);
        }

        $evaluacionDocente = $nota->evaluaciondocente;

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
                        'nombre' => $estudiante->nombre_estudiante,
                        'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                        'promedioNotas' => 0,
                        'totalTareas' => 0,
                        'evaluacionDocente' => $evaluacionDocente,
                    ];
                }
                // Sumar la calificación de la tarea actual al estudiante correspondiente
                $notasEstudiantes[$estudiante->id_estudiante]['promedioNotas'] += $tarea->calificion;
                $notasEstudiantes[$estudiante->id_estudiante]['totalTareas']++;
            }
        }

        // Calcular el promedio final de cada estudiante y guardar en NotasSprint
        foreach ($notasEstudiantes as $idEstudiante => &$estudianteData) {
            if ($estudianteData['totalTareas'] > 0) {
                $promedioTareas = $estudianteData['promedioNotas'] / $estudianteData['totalTareas'];

                // Crear o actualizar NotasSprint con la nota promedio de tareas
                $notaSprint = NotasSprint::updateOrCreate(
                    [
                        'id_tarea' => $tarea->id_tarea, // Relacionar con la tarea correspondiente
                    ],
                    [
                        'nota_tarea' => $promedioTareas,
                    ]
                );

                // Calcular el promedio final incluyendo la evaluación docente
                $notaPromedio = ($promedioTareas * $evaluacionDocente) / 100;

                // Actualizar nota promedio en NotasSprint
                $notaSprint->nota_tarea = $notaPromedio;
                $notaSprint->save();

                // Guardar la nueva nota promedio para mostrar en la tabla
                $estudianteData['promedioNotas'] = $notaPromedio;
            }
        }

        // Devolver la respuesta con las notas promedio por cada estudiante
        return response()->json(array_values($notasEstudiantes), 200);
    }
}
