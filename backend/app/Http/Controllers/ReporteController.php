<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class ReporteController extends Controller
{
    /**
     * Obtener el reporte completo de un estudiante.
     *
     * @param int $id_estudiante
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudentReport($id_estudiante)
    {
        try {
            // Cargar relaciones necesarias incluyendo evaluaciones finales y criterios evaluados
            $estudiante = Estudiante::with([
                'empresa',
                'tareas',
                'evaluadoEvaluacionesFinales',
                'evaluadoCriterios',
            ])->findOrFail($id_estudiante);

            // Estructurar la respuesta
            return response()->json([
                'estudiante' => [
                    'id_estudiante' => $estudiante->id_estudiante,
                    'nombre' => $estudiante->nombre_estudiante,
                    'ap_pat' => $estudiante->ap_pat,
                    'ap_mat' => $estudiante->ap_mat,
                    'codigo_sis' => $estudiante->codigo_sis,
                    'correo' => $estudiante->correo,
                    'empresa' => $estudiante->empresa ? [
                        'id_empresa' => $estudiante->empresa->id_empresa,
                        'nombre_empresa' => $estudiante->empresa->nombre_empresa,
                    ] : null,
                    'tareas' => $estudiante->tareas->map(function ($tarea) {
                        return [
                            'id_tarea' => $tarea->id_tarea,
                            'nombre_tarea' => $tarea->nombre_tarea,
                            'estimacion' => $tarea->estimacion,
                            'estado' => $tarea->estado,
                            'resultado_evaluacion' => $tarea->pivot->resultado_evaluacion ?? null,
                            'descripcion_evaluacion' => $tarea->pivot->descripcion_evaluacion ?? null,
                        ];
                    }),
                    'evaluacionesFinales' => $estudiante->evaluadoEvaluacionesFinales->map(function ($evaluacion) {
                        return [
                            'id_evaluacion_final' => $evaluacion->id_evaluacion_final, // Ajusta según tu esquema
                            'autoevaluacion' => $evaluacion->autoevaluacion,
                            'pares' => $evaluacion->pares,
                            'evaluaciondocente' => $evaluacion->evaluaciondocente,
                            'paga' => $evaluacion->paga,
                            'id_docente' => $evaluacion->id_docente,
                            'id_sprint' => $evaluacion->id_sprint,
                            'id_empresa' => $evaluacion->id_empresa,
                            'fecha_evaluacion' => $evaluacion->fecha_evaluacion, // Ajusta según tu esquema
                            // Otros campos según tu esquema
                        ];
                    }),
                    'criteriosEvaluados' => $estudiante->evaluadoCriterios->map(function ($criterio) {
                        return [
                            'id_criterio' => $criterio->id_criterio,
                            'nombre_criterio' => $criterio->nombre_criterio,
                            'descripcion' => $criterio->descripcion,
                            'id_sprint' => $criterio->pivot->id_sprint,
                            'evaluador' => [
                                'id_estudiante_evaluador' => $criterio->pivot->id_estudiante_evaluador,
                                'nombre_evaluador' => $criterio->pivot->evaluador->nombre_estudiante ?? 'Desconocido', // Ajusta según tu esquema
                            ],
                            // Otros campos según tu esquema
                        ];
                    }),
                ],
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Estudiante no encontrado'], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            Log::error('Error al obtener el reporte del estudiante: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al obtener el reporte del estudiante',
                'message' => app()->environment('production') ? 'Ocurrió un error inesperado.' : $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
