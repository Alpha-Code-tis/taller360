<?php

namespace App\Http\Controllers;

use App\Models\Ajuste;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

class AjustesController extends Controller
{
    /**
     * Guarda las fechas en la tabla ajustes.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha_inicio_autoevaluacion' => ['nullable', 'date'],
            'fecha_fin_autoevaluacion' => ['nullable', 'date'],
            'fecha_inicio_eva_final' => ['nullable', 'date'],
            'fecha_fin_eva_final' => ['nullable', 'date'],
            'fecha_inicio_eva_cruzada' => ['nullable', 'date'],
            'fecha_fin_eva_cruzada' => ['nullable', 'date']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'error' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        try {
            $ajuste = Ajuste::first();

            if (!$ajuste) {
                return response()->json(['error' => 'ajuste no encontrado'], 404);
            }
            $ajuste->update($validator->validated());
            return response()->json([
                'message' => 'ajustes guardadas exitosamente.'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar los ajustes',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show()
    {
        $ajuste = Ajuste::first();

        if ($ajuste) {
            return response()->json($ajuste);
        } else {
            return response()->json(['error' => 'ajuste no encontrado'], 404);
        }
    }
}
