<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AutoevaluacionController extends Controller
{
    public function mostrarEstudiantesTareas()
    {
        $estudiantes = Estudiante::with('tareas')->get();
        return response()->json($estudiantes);
    }

    public function update(Request $request, $tareaId)
    {
        $validator = Validator::make($request->all(), [
            'resultado_evaluacion' => ['required', 'string', 'max:20'],
            'descripcion_evaluacion' => ['required', 'string', 'max:255']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'error' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $estudiante = auth()->guard('sanctum')->user();
            $estudiante->tareas()->updateExistingPivot($tareaId, $validator->validated());

            return response()->json([
                'message' => 'Autoevaluación realizada exitosamente.'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al realizar la autoevaluación',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
