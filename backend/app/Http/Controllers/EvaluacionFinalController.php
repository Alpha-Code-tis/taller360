<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EvaluacionFinal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

class EvaluacionFinalController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_est_evaluado' => ['required', 'integer',],
            'resultado_escala' => ['required', 'string',],
            'resultado_comentario' => ['required', 'string', 'max:255']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'error' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $estudiante = auth()->guard('sanctum')->user();
            $evaluacion = EvaluacionFinal::create([
                'id_est_evaluador' => $estudiante->id_estudiante,
                'id_est_evaluado' => $request->id_est_evaluado,
                'resultado_escala' => $request->resultado_escala,
                'resultado_comentario' => $request->resultado_comentario,
            ]);

        return response()->json(['message' => 'Evaluación guardada correctamente', 'evaluacion' => $evaluacion], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al realizar la evaluación final',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obtener todas las evaluaciones de un estudiante
    public function showEvaluaciones($id_est_evaluado)
    {
        $evaluaciones = EvaluacionFinal::where('id_est_evaluado', $id_est_evaluado)->with('evaluador')->get();
        return response()->json($evaluaciones);
    }
}

