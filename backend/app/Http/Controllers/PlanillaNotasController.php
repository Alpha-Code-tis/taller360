<?php

namespace App\Http\Controllers;

use App\Models\Alcance;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\EstudianteTarea;
use App\Models\Evaluacion;
use App\Models\NotasSprint;
use App\Models\Nota;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PlanillaNotasController extends Controller
{
    // Obtener los equipos (empresas) del docente autenticado
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

        // Obtener las empresas asociadas al docente
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

    // Mostrar la nota de evaluación para una empresa y sprint específicos
    public function mostrarNotaEvaluacion($empresaId, $sprintId)
    {
        // Verificar que la empresa existe
        $planificacion = Planificacion::where('id_empresa', $empresaId)->first();

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
            ->with('estudiantes')
            ->get();

        if ($tareas->isEmpty()) {
            return response()->json(['error' => 'No se encontraron tareas para el sprint especificado'], 404);
        }

        // Crear una estructura para almacenar las notas por estudiante
        $notasEstudiantes = $this->calcularNotaEvaluacion($tareas);
        $notasEstudiantes = $this->calcularNotaAutoEvaluacion($tareas, $notasEstudiantes);
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

        // Obtener todos los estudiantes de la empresa
        $estudiantes = Estudiante::where('id_empresa', $empresaId)->get();
        if ($estudiantes->isEmpty()) {
            return response()->json(['error' => 'No se encontraron estudiantes para la empresa especificada'], 404);
        }

        // Obtener los alcances del sprint
        $alcances = Alcance::where('id_sprint', $sprint->id_sprint)->get();
        if ($alcances->isEmpty()) {
            return response()->json(['error' => 'No se encontraron alcances para el sprint especificado'], 404);
        }

        // Obtener todas las tareas de los alcances del sprint
        $tareas = Tarea::whereIn('id_alcance', $alcances->pluck('id_alcance'))->get();
        if ($tareas->isEmpty()) {
            return response()->json(['error' => 'No se encontraron tareas para el sprint especificado'], 404);
        }

        // Obtener los porcentajes desde el modelo Nota
        $docente = Auth::user();
        $nota = Nota::where('id_docente', $docente->id_docente)
            ->where('id_empresa', $empresaId)
            ->where('id_sprint', $sprint->id_sprint)
            ->first();

        if (!$nota) {
            return response()->json(['error' => 'No se encontró la configuración de porcentajes para el sprint especificado'], 404);
        }

        $evaluacionDocente = $nota->evaluaciondocente; // Porcentaje para nota_tarea
        $autoEvaluacion = $nota->autoevaluacion; // Porcentaje para nota_auto_ev
        $pares = $nota->pares; // Porcentaje para nota_ev_pares

        $notasEstudiantes = [];
        foreach ($estudiantes as $estudiante) {
            $notasEstudiantes[$estudiante->id_estudiante] = [
                'nombre' => $estudiante->nombre_estudiante,
                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'notaTarea' => 0,
                'notaAutoEv' => 0,
                'notaEvPares' => 0,
                'notaTotal' => 0,
            ];

            // Obtener las tareas del estudiante para este sprint
            $tareasEstudiante = $estudiante->tareas()
                ->whereIn('tarea.id_tarea', $tareas->pluck('id_tarea'))
                ->get();

            // 1. Calcular notaTarea (promedio de calificaciones de tareas)
            $notaTareaTotal = 0;
            $contadorNotasTarea = 0;

            foreach ($tareasEstudiante as $tarea) {
                if ($tarea->calificacion !== null) {
                    $notaTareaTotal += $tarea->calificacion;
                    $contadorNotasTarea++;
                }
            }

            $promedioNotaTarea = $contadorNotasTarea > 0 ? $notaTareaTotal / $contadorNotasTarea : 0;

            // Aplicar el porcentaje de evaluacionDocente
            $notasEstudiantes[$estudiante->id_estudiante]['notaTarea'] = ($evaluacionDocente * $promedioNotaTarea) / 100;

            // 2. Calcular notaAutoEv
            $resultadoEvaluacionMap = [
                'Malo' => 1,
                'Regular' => 2,
                'Aceptable' => 3,
                'Bueno' => 4,
                'Excelente' => 5
            ];

            $totalResultadoEvaluacion = 0;
            $contadorAutoEv = 0;

            foreach ($tareasEstudiante as $tarea) {
                $resultadoTexto = $tarea->pivot->resultado_evaluacion;

                if ($resultadoTexto === null) {
                    Log::info('Sin resultado de autoevaluación para la tarea ID: ' . $tarea->id_tarea . ' y estudiante ID: ' . $estudiante->id_estudiante);
                    continue;
                }

                $resultado = $resultadoEvaluacionMap[$resultadoTexto] ?? 0;
                $totalResultadoEvaluacion += $resultado;
                $contadorAutoEv++;
            }

            $promedioNotaAutoEv = $contadorAutoEv > 0 ? $totalResultadoEvaluacion / $contadorAutoEv : 0;

            // Aplicar el porcentaje de autoEvaluacion
            $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] = ($autoEvaluacion * $promedioNotaAutoEv) / 100;

            // 3. Calcular notaEvPares
            $totalPorcentajeCriterios = DB::table('estudiante_criterio')
                ->join('criterios', 'estudiante_criterio.id_criterio', '=', 'criterios.id_criterio')
                ->where('estudiante_criterio.id_estudiante_evaluado', $estudiante->id_estudiante)
                ->where('estudiante_criterio.id_sprint', $sprint->id_sprint)
                ->sum('criterios.porcentaje');

            if ($totalPorcentajeCriterios == 0) {
                Log::info('No se encontraron criterios evaluados para el estudiante ID: ' . $estudiante->id_estudiante);
            }
            // Aplicar el porcentaje de pares
            $notasEstudiantes[$estudiante->id_estudiante]['notaEvPares'] = ($pares * $totalPorcentajeCriterios) / 100;

            // Asegurarse de que las notas sean numéricas
            $notaTarea = (float) $notasEstudiantes[$estudiante->id_estudiante]['notaTarea'];
            $notaAutoEv = (float) $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'];
            $notaEvPares = (float) $notasEstudiantes[$estudiante->id_estudiante]['notaEvPares'];

            // 4. Calcular notaTotal
            $notasEstudiantes[$estudiante->id_estudiante]['notaTotal'] = $notaTarea + $notaAutoEv + $notaEvPares;

            // Guardar las notas en NotasSprint
            NotasSprint::updateOrCreate(
                [
                    'id_estudiante' => $estudiante->id_estudiante,
                    'id_sprint' => $sprint->id_sprint,
                ],
                [
                    'nota_tarea' => $notaTarea,
                    'nota_auto_ev' => $notaAutoEv,
                    'nota_ev_pares' => $notaEvPares,
                    'nota_total' => $notasEstudiantes[$estudiante->id_estudiante]['notaTotal'],
                ]
            );
        }

        // Devolver la respuesta con las notas sumadas por cada estudiante
        return response()->json([
            'notasEstudiantes' => array_values($notasEstudiantes),
        ], 200);
    }

    // Métodos privados para cálculos adicionales si es necesario
    private function calcularNotaEvaluacion($tareas)
    {
        $notasEstudiantes = [];

        foreach ($tareas as $tarea) {
            $calificacionTarea = $tarea->calificacion ?? 0;

            foreach ($tarea->estudiantes as $estudiante) {
                if (!isset($notasEstudiantes[$estudiante->id_estudiante])) {
                    $notasEstudiantes[$estudiante->id_estudiante] = [
                        'nombre' => $estudiante->nombre_estudiante,
                        'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                        'notaTarea' => 0,
                        'notaAutoEv' => 0,
                        'notaEvPares' => 0,
                        'notaTotal' => 0,
                    ];
                }

                $notasEstudiantes[$estudiante->id_estudiante]['notaTarea'] += $calificacionTarea;
            }
        }

        return $notasEstudiantes;
    }

    private function calcularNotaAutoEvaluacion($tareas, $notasEstudiantes)
    {
        $resultadoEvaluacionMap = [
            'Malo' => 1,
            'Regular' => 2,
            'Aceptable' => 3,
            'Bueno' => 4,
            'Excelente' => 5
        ];

        foreach ($tareas as $tarea) {
            foreach ($tarea->estudiantes as $estudiante) {
                $estudianteTarea = EstudianteTarea::where('id_estudiante', $estudiante->id_estudiante)
                    ->where('id_tarea', $tarea->id_tarea)
                    ->first();

                if ($estudianteTarea && isset($estudianteTarea->resultado_evaluacion)) {
                    $resultado = $resultadoEvaluacionMap[$estudianteTarea->resultado_evaluacion] ?? 0;
                    $notasEstudiantes[$estudiante->id_estudiante]['notaAutoEv'] += $resultado;
                }
            }
        }

        return $notasEstudiantes;
    }
}
