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
use App\Models\Estudiante;
use App\Models\Pare;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PlanillaNotasController extends Controller
{
    public function getEquipos()
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
    public function getSprints($empresaId)
    {
        $sprints = Sprint::whereIn('id_planificacion', function ($query) use ($empresaId) {
            $query->select('id_planificacion')
                ->from('planificacion')
                ->where('id_empresa', $empresaId);
        })->get();

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
        $autoEvaluacion = $nota->autoevaluacion;

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
        $notasEstudiantes = $this->calcularNotaEvaluacion($tareas, $evaluacionDocente, $sprint);
        $notasEstudiantes = $this->calcularNotaAutoEvaluacion($tareas, $notasEstudiantes, $autoEvaluacion, $sprint);

        // Devolver la respuesta con las notas promedio por cada estudiante, incluyendo la evaluación docente y autoevaluación
        return response()->json([
            'evaluacionDocente' => $evaluacionDocente,
            'autoEvaluacion' => $autoEvaluacion,
            'notasEstudiantes' => array_values($notasEstudiantes)
        ], 200);
    }

    private function calcularNotaEvaluacion($tareas, $evaluacionDocente, $sprint)
    {
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
                        'notaAutoEv' => 0,
                        'totalEvaluaciones' => 0
                    ];
                }
                // Sumar la calificación de la tarea actual al estudiante correspondiente
                $notasEstudiantes[$estudiante->id_estudiante]['promedioNotas'] += $tarea->calificacion;
                $notasEstudiantes[$estudiante->id_estudiante]['totalTareas']++;

                // Calcular el promedio final de tareas
                if ($notasEstudiantes[$estudiante->id_estudiante]['totalTareas'] > 0) {
                    $promedioTareas = $notasEstudiantes[$estudiante->id_estudiante]['promedioNotas'] / max($notasEstudiantes[$estudiante->id_estudiante]['totalTareas'], 1);

                    // Crear o actualizar NotasSprint con la nota promedio de tareas, pero sin usar 'id_estudiante' directamente
                    $notaSprint = NotasSprint::updateOrCreate(
                        [
                            'id_tarea' => $tarea->id_tarea,
                        ],
                        [
                            'nota_tarea' => $promedioTareas,
                        ]
                    );

                    // Calcular el promedio final incluyendo la evaluación docente
                    $notaPromedio = $promedioTareas * ($evaluacionDocente / 100);

                    // Actualizar nota promedio en NotasSprint
                    $notaSprint->nota_tarea = $notaPromedio;
                    $notaSprint->save();
                    // Guardar la nueva nota promedio para mostrar en la tabla
                    $notasEstudiantes[$estudiante->id_estudiante]['promedioNotas'] = $notaPromedio;
                }
            }
        }
        return $notasEstudiantes;
    }

    private function calcularNotaAutoEvaluacion($tareas, $notasEstudiantes, $autoEvaluacion, $sprint)
    {
        foreach ($tareas as $tarea) {
            foreach ($tarea->estudiantes as $estudiante) {
                // Obtener la autoevaluación de la tarea
                if ($tarea->pivot && isset($tarea->pivot->resultado_evaluacion)) {
                    // Convertir el valor de resultado_evaluacion de cadena a número
                    $resultadoEvaluacionMap = [
                        'Malo' => 1,
                        'Regular' => 2,
                        'Aceptable' => 3,
                        'Bueno' => 4,
                        'Excelente' => 5
                    ];
                    $resultadoEvaluacion = $resultadoEvaluacionMap[$tarea->pivot->resultado_evaluacion] ?? null;

                    // Verificar que el resultado de la evaluación esté en el rango válido
                    if ($resultadoEvaluacion !== null) {
                        $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] += $resultadoEvaluacion;
                        $notasEstudiantes[$estudiante->id_estudiante]['totalEvaluaciones']++;
                    }
                }

                // Calcular el promedio de autoevaluación
                if ($notasEstudiantes[$estudiante->id_estudiante]['totalEvaluaciones'] > 0) {
                    $promedioAutoEv = $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] / max($notasEstudiantes[$estudiante->id_estudiante]['totalEvaluaciones'], 1);
                    $notaAutoEvPromedio = $promedioAutoEv * ($autoEvaluacion / 100);

                    // Crear o actualizar NotasSprint con la nota de autoevaluación, utilizando id_tarea
                    $notaSprint = NotasSprint::updateOrCreate(
                        [
                            'id_tarea' => $tarea->id_tarea,
                        ],
                        [
                            'nota_auto_ev' => $notaAutoEvPromedio
                        ]
                    );

                    // Guardar la nota de autoevaluación para mostrar en la tabla
                    $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] = $notaAutoEvPromedio;
                }
            }
        }

        return $notasEstudiantes;
    }
    public function calcularEvaluacionPares($empresaId, $sprintId)
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

        // Obtener todos los estudiantes de la empresa
        $estudiantes = Estudiante::where('id_empresa', $empresaId)->get();


        // Crear una estructura para almacenar las notas por estudiante
        $notasEstudiantes = [];

        foreach ($estudiantes as $estudiante) {
            // Obtener las evaluaciones de pares del estudiante evaluado para el sprint actual
            $pares = Pare::whereHas('evaluacion', function ($query) use ($sprint) {
                $query->where('id_sprint', $sprint->id_sprint);
            })->where('id_estudiante', $estudiante->id_estudiante)->get();

            if ($pares->isEmpty()) {
                continue;
            }

            // Calcular la sumatoria de los porcentajes de los criterios
            $sumatoriaPorcentajes = 0;
            $totalCriterios = 0;

            foreach ($pares as $par) {
                foreach ($par->detalle_pars as $detalle) {
                    $sumatoriaPorcentajes += $detalle->porcentaje;
                    $totalCriterios++;
                }
            }

            // Calcular el promedio de los porcentajes
            $promedioPares = $totalCriterios > 0 ? $sumatoriaPorcentajes / $totalCriterios : 0;

            // Crear o actualizar NotasSprint con la nota de evaluación entre pares
            $notaSprint = NotasSprint::updateOrCreate(
                [
                    'id_tarea' => $par->id_tarea, // Considera agregar id_tarea para relacionarlo con una tarea específica
                ],
                [
                    'nota_ev_pares' => $promedioPares,
                ]
            );


            // Calcular el promedio final de la evaluación con pares
            $notaPromedioFinal = ($notaSprint->nota_tarea + $notaSprint->nota_auto_ev + $promedioPares) / 3;

            // Actualizar nota_ev_pares con el promedio calculado
            $notaSprint->nota_ev_pares = $notaPromedioFinal;
            $notaSprint->save();

            // Guardar los resultados para cada estudiante
            $notasEstudiantes[$estudiante->id_estudiante] = [
                'nombre' => $estudiante->nombre_estudiante,
                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'notaTarea' => 0,
                'notaEvPares' => 0,
                'notaAutoEv' => 0,
                'totalTareas' => 0,
                'notaTotal' => 0

            ];
        }

        // Devolver la respuesta con las notas promedio por cada estudiante
        return response()->json([
            'notasEstudiantes' => array_values($notasEstudiantes)
        ], 200);
    }
    public function calcularSumatoriaNotas($empresaId, $sprintId)
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

    // Obtener todas las tareas de los alcances del sprint
    $tareas = Tarea::whereIn('id_alcance', $alcances->pluck('id_alcance'))->get();

    // Verificar si hay tareas asociadas
    if ($tareas->isEmpty()) {
        return response()->json(['error' => 'No se encontraron tareas para los alcances del sprint especificado'], 404);
    }

    // Crear una estructura para almacenar las notas por estudiante
    $notasEstudiantes = [];

    foreach ($tareas as $tarea) {
        // Obtener los estudiantes asociados con cada tarea
        $estudiantes = $tarea->estudiantes;

        foreach ($estudiantes as $estudiante) {
            // Obtener o crear una nueva nota del sprint relacionada a la tarea del estudiante
            $notaSprint = NotasSprint::updateOrCreate(
                [
                    'id_tarea' => $tarea->id_tarea,
                ],
                [
                    // Inicializa las notas si no existen
                    'nota_tarea' => $tarea->calificacion ?? 0,
                    'nota_auto_ev' => 0,
                    'nota_ev_pares' => 0,
                    'nota_total' => 0,
                ]
            );

            // Actualizar la estructura de notas para cada estudiante
            if (!isset($notasEstudiantes[$estudiante->id_estudiante])) {
                $notasEstudiantes[$estudiante->id_estudiante] = [
                    'nombre' => $estudiante->nombre_estudiante,
                    'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                    'notaTarea' => 0,
                    'notaEvPares' => 0,
                    'notaAutoEv' => 0,
                    'notaTotal' => 0,
                    'totalNotas' => 0 // Contador para promediar las notas
                ];
            }

            // Sumar cada nota para el estudiante correspondiente
            $notasEstudiantes[$estudiante->id_estudiante]['notaTarea'] += $notaSprint->nota_tarea;
            $notasEstudiantes[$estudiante->id_estudiante]['notaEvPares'] += $notaSprint->nota_ev_pares;
            $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] += $notaSprint->nota_auto_ev;

            // Aumentar el contador de notas
            $notasEstudiantes[$estudiante->id_estudiante]['totalNotas']++;
        }
    }

    // Calcular el promedio de las notas para cada estudiante y la nota total
    foreach ($notasEstudiantes as &$estudianteNota) {
        if ($estudianteNota['totalNotas'] > 0) {
            // Promediar cada nota específica
            $estudianteNota['notaTarea'] = round($estudianteNota['notaTarea'] / $estudianteNota['totalNotas'], 1);
            $estudianteNota['notaEvPares'] = round($estudianteNota['notaEvPares'] / $estudianteNota['totalNotas'], 1);
            $estudianteNota['notaAutoEv'] = round($estudianteNota['notaAutoEv'] / $estudianteNota['totalNotas'], 1);

            // Calcular el promedio de la nota total
            $estudianteNota['notaTotal'] = round(
                ($estudianteNota['notaTarea'] + $estudianteNota['notaEvPares'] + $estudianteNota['notaAutoEv']) / 3,
                1
            );
        }
    }

    // Incluir los valores de evaluación docente, pares, y autoevaluación (suponiendo que provienen de la tabla `notas`)
    $nota = Nota::where('id_empresa', $empresaId)
                ->where('id_sprint', $sprint->id_sprint)
                ->first();

    $evaluacionDocente = $nota ? $nota->evaluaciondocente : 0;
    $pares = $nota ? $nota->pares : 0;
    $autoevaluacion = $nota ? $nota->autoevaluacion : 0;
    $notaTotal = $nota ? $nota->paga : 0;

    // Devolver la respuesta con las notas sumadas por cada estudiante
    return response()->json([
        'notasEstudiantes' => array_values($notasEstudiantes),
        'evaluacionDocente' => $evaluacionDocente,
        'pares' => $pares,
        'autoevaluacion' => $autoevaluacion,
        'notaTotal' => $notaTotal, // Aquí notaTotal ahora es el valor de `paga`
    ], 200);
}

}