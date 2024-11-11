<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class EvaluacionParesController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'criterios_ids.*' => ['required', 'integer', 'exists:criterios,id_criterio'],
            'id_estudiante_evaludado' => ['required', 'integer', 'exists:estudiante,id_estudiante'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'error' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $estudianteEvaluador = auth()->guard('sanctum')->user();
            $estudianteEvaluado = Estudiante::find($request->id_estudiante_evaludado);

            $estudianteEvaluado->evaluadoCriterios()->syncWithPivotValues($request->criterios_ids, ['id_estudiante_evaluador' => $estudianteEvaluador->id_estudiante]);

            return response()->json([
                'message' => 'evaluación realizada exitosamente.'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al realizar la evaluación',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function getEvaluacionPares($id_estudiante_evaluado)
    {
        $estudianteEvaluado = Estudiante::find($id_estudiante_evaluado);

        if (!$estudianteEvaluado) {
            return response()->json([
                'message' => 'Estudiante no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        }

        $criteriosEvaluado = $estudianteEvaluado->evaluadoCriterios;
        $criteriosEvaludoAgrupado = $criteriosEvaluado->map(function ($item, $key) {
            $item->estudiante_evaluador = Estudiante::find($item->pivot->id_estudiante_evaluador);
            return $item;
        })->values();

        return response()->json($criteriosEvaludoAgrupado, Response::HTTP_OK);
    }
}
