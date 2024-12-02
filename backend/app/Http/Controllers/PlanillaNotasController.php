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
use App\Models\EstudianteTarea;
use App\Models\Evaluacion;
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

        foreach ($tareas as $tarea) {
            // Calcular la nota de la tarea ponderada por la evaluación docente
            $calificacionTarea = $tarea->calificacion ?? 0;
            $notaTarea = $calificacionTarea * ($evaluacionDocente / 100);

            // Guardar la nota de la tarea en NotasSprint (ya que es por tarea)
            $notaSprint = NotasSprint::updateOrCreate(
                [
                    'id_tarea' => $tarea->id_tarea,
                ],
                [
                    'nota_tarea' => $notaTarea,
                    // Las demás notas se dejan como están, ya que varían por estudiante
                ]
            );

            // Asociar la nota de la tarea a cada estudiante que tiene asignada la tarea
            foreach ($tarea->estudiantes as $estudiante) {
                if (!isset($notasEstudiantes[$estudiante->id_estudiante])) {
                    $notasEstudiantes[$estudiante->id_estudiante] = [
                        'nombre' => $estudiante->nombre_estudiante,
                        'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                        'notaTarea' => 0,
                        'notaAutoEv' => 0,
                        'notaEvPares' => 0,
                        'totalTareas' => 0,
                        'totalAutoEv' => 0,
                        'totalPares' => 0,
                    ];
                }
                // Acumular las notas de las tareas para el estudiante
                $notasEstudiantes[$estudiante->id_estudiante]['notaTarea'] += $notaTarea;
                $notasEstudiantes[$estudiante->id_estudiante]['totalTareas']++;
            }
        }

        // Calcular el promedio de notas por estudiante
        foreach ($notasEstudiantes as &$datosEstudiante) {
            if ($datosEstudiante['totalTareas'] > 0) {
                $datosEstudiante['notaTarea'] = $datosEstudiante['notaTarea'] / $datosEstudiante['totalTareas'];
            }
        }

        return $notasEstudiantes;
    }

    private function calcularNotaAutoEvaluacion($tareas, $notasEstudiantes, $autoEvaluacion, $sprint)
    {
        foreach ($tareas as $tarea) {
            foreach ($tarea->estudiantes as $estudiante) {
                // Obtener la autoevaluación del estudiante para la tarea
                $estudianteTarea = EstudianteTarea::where('id_estudiante', $estudiante->id_estudiante)
                    ->where('id_tarea', $tarea->id_tarea)
                    ->first();

                if ($estudianteTarea && isset($estudianteTarea->resultado_evaluacion)) {
                    $resultadoEvaluacionMap = [
                        'Malo' => 1,
                        'Regular' => 2,
                        'Aceptable' => 3,
                        'Bueno' => 4,
                        'Excelente' => 5
                    ];
                    $resultadoEvaluacion = $resultadoEvaluacionMap[$estudianteTarea->resultado_evaluacion] ?? null;

                    if ($resultadoEvaluacion !== null) {
                        if (!isset($notasEstudiantes[$estudiante->id_estudiante])) {
                            $notasEstudiantes[$estudiante->id_estudiante] = [
                                'nombre' => $estudiante->nombre_estudiante,
                                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                                'notaTarea' => 0,
                                'notaAutoEv' => 0,
                                'notaEvPares' => 0,
                                'totalTareas' => 0,
                                'totalAutoEv' => 0,
                                'totalPares' => 0,
                            ];
                        }
                        $notaAutoEv = $resultadoEvaluacion * ($autoEvaluacion / 100);

                        $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] += $notaAutoEv;
                        $notasEstudiantes[$estudiante->id_estudiante]['totalAutoEv']++;
                    }
                }
            }
        }

        // Calcular el promedio de autoevaluación por estudiante
        foreach ($notasEstudiantes as &$datosEstudiante) {
            if ($datosEstudiante['totalAutoEv'] > 0) {
                $datosEstudiante['notaAutoEv'] = $datosEstudiante['notaAutoEv'] / $datosEstudiante['totalAutoEv'];
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

        $notasEstudiantes = [];

        foreach ($estudiantes as $estudiante) {
            // Obtener las evaluaciones del estudiante para el sprint actual
            $evaluaciones = Evaluacion::where('id_estudiante', $estudiante->id_estudiante)
                ->whereHas('tarea.alcance.sprint', function ($query) use ($sprintId) {
                    $query->where('id_sprint', $sprintId);
                })
                ->with('pares.detalle_pars') // Eager load pares and detalle_pars
                ->get();

            if ($evaluaciones->isEmpty()) {
                continue;
            }

            $sumatoriaPorcentajes = 0;
            $totalCriterios = 0;

            foreach ($evaluaciones as $evaluacion) {
                foreach ($evaluacion->pares as $par) {
                    foreach ($par->detalle_pars as $detalle) {
                        $sumatoriaPorcentajes += $detalle->porcentaje;
                        $totalCriterios++;
                    }
                }
            }

            $promedioPares = $totalCriterios > 0 ? $sumatoriaPorcentajes / $totalCriterios : 0;

            $notasEstudiantes[$estudiante->id_estudiante] = [
                'nombre' => $estudiante->nombre_estudiante,
                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'notaEvPares' => $promedioPares,
            ];
        }

        // Devolver las notas calculadas por estudiante
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

        // Primero, obtener las notas de evaluación docente y autoevaluación
        $nota = Nota::where('id_empresa', $empresaId)
            ->where('id_sprint', $sprint->id_sprint)
            ->first();

        $evaluacionDocente = $nota ? $nota->evaluaciondocente : 0;
        $pares = $nota ? $nota->pares : 0;
        $autoevaluacion = $nota ? $nota->autoevaluacion : 0;
        $notaTotalEmpresa = $nota ? $nota->paga : 0;

        // Obtener todas las tareas del sprint
        $alcances = Alcance::where('id_sprint', $sprint->id_sprint)->get();
        $tareas = Tarea::whereIn('id_alcance', $alcances->pluck('id_alcance'))->with('estudiantes')->get();

        // Calcular las notas por estudiante
        $notasEstudiantes = $this->calcularNotaEvaluacion($tareas, $evaluacionDocente, $sprint);
        $notasEstudiantes = $this->calcularNotaAutoEvaluacion($tareas, $notasEstudiantes, $autoevaluacion, $sprint);

        // Obtener las evaluaciones de pares y combinarlas
        $evaluacionesPares = $this->obtenerEvaluacionesPares($empresaId, $sprintId);

        foreach ($notasEstudiantes as $idEstudiante => &$datosEstudiante) {
            $notaEvPares = isset($evaluacionesPares[$idEstudiante]) ? $evaluacionesPares[$idEstudiante]['notaEvPares'] : 0;
            $datosEstudiante['notaEvPares'] = $notaEvPares;

            // Calcular la nota total
            $datosEstudiante['notaTotal'] = ($datosEstudiante['notaTarea'] + $datosEstudiante['notaAutoEv'] + $datosEstudiante['notaEvPares']) / 3;
        }

        // Devolver la respuesta con las notas sumadas por cada estudiante
        return response()->json([
            'notasEstudiantes' => array_values($notasEstudiantes),
            'evaluacionDocente' => $evaluacionDocente,
            'pares' => $pares,
            'autoevaluacion' => $autoevaluacion,
            'notaTotalEmpresa' => $notaTotalEmpresa,
        ], 200);
    }

    private function obtenerEvaluacionesPares($empresaId, $sprintId)
    {
        // Obtener todos los estudiantes de la empresa
        $estudiantes = Estudiante::where('id_empresa', $empresaId)->get();

        $evaluacionesPares = [];

        foreach ($estudiantes as $estudiante) {
            // Obtener las evaluaciones relacionadas con el estudiante a través de las tareas asignadas
            $evaluaciones = Evaluacion::whereHas('tarea.estudiantes', function ($query) use ($estudiante) {
                $query->where('estudiante.id_estudiante', $estudiante->id_estudiante);
            })
                ->whereHas('tarea.alcance.sprint', function ($query) use ($sprintId) {
                    $query->where('id_sprint', $sprintId);
                })
                ->with('pares.detalle_pars') // Carga ansiosa de pares y detalle_pars
                ->get();

            $sumatoriaPorcentajes = 0;
            $totalCriterios = 0;

            foreach ($evaluaciones as $evaluacion) {
                foreach ($evaluacion->pares as $par) {
                    foreach ($par->detalle_pars as $detalle) {
                        $sumatoriaPorcentajes += $detalle->porcentaje;
                        $totalCriterios++;
                    }
                }
            }

            // Calcular el promedio de los porcentajes
            $promedioPares = $totalCriterios > 0 ? $sumatoriaPorcentajes / $totalCriterios : 0;

            $evaluacionesPares[$estudiante->id_estudiante] = [
                'nombre' => $estudiante->nombre_estudiante,
                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'notaEvPares' => $promedioPares,
            ];
        }

        return $evaluacionesPares;
    }
}
