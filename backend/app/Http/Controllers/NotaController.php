<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use App\Models\Planificacion;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use \Illuminate\Support\Facades\Validator;

class NotaController extends Controller
{
    public function index()
    {
        $notas = Nota::all();
        return response()->json($notas, Response::HTTP_OK);
    }
    public function show($id_empresa, $sprint)
    {
        if (!$id_empresa || !$sprint) {
            return response()->json(['message' => 'Empresa o Sprint no seleccionados'], Response::HTTP_BAD_REQUEST);
        }
        $docente = auth()->guard('sanctum')->user();

        // Buscar las notas asociadas al docente autenticado
        $planificacion = Planificacion::where('id_empresa', $id_empresa)
            ->first();

        $sprint = Sprint::where('id_planificacion', $planificacion->id_planificacion)
            ->where('nro_sprint', $sprint)
            ->first();
        $nota = Nota::where('id_docente', $docente->id_docente)
            ->where('id_empresa', $id_empresa)
            ->where('id_sprint', $sprint->id_sprint)
            ->first();

        if ($nota) {
            return response()->json($nota);
        }

        return response()->json(['message' => 'Nota no encontrada'], Response::HTTP_NO_CONTENT);
    }

    public function store(Request $request)
    {
        $docente = auth()->guard('sanctum')->user();

        $validator = Validator::make($request->all(), [
            'autoevaluacion' => 'required|integer',
            'pares' => 'required|integer',
            'evaluaciondocente' => 'required|integer',
            'paga' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        // Crear la nota con los datos validados
        $nota = Nota::create([
            'autoevaluacion' => $request->autoevaluacion,
            'pares' => $request->pares,
            'evaluaciondocente' => $request->evaluaciondocente,
            'paga' => $request->paga,
            'id_docente' => $docente->id_docente, // Agregar el id_docente
        ]);

        return response()->json($nota, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $nota = Nota::find($id);
        if (!$nota) {
            return response()->json(['message' => 'Nota no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'autoevaluacion' => 'integer',
            'pares' => 'integer',
            'evaluaciondocente' => 'integer',
            'paga' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $nota->update($validator->validated());
        return response()->json($nota);
    }

    public function evaluacionConfig(Request $request)
    {
        $docente = auth()->guard('sanctum')->user();

        $validator = Validator::make($request->all(), [
            'empresa' => 'required|integer|exists:empresa,id_empresa',
            'sprint' => 'required|integer',
            'autoevaluacion' => 'required|integer|between:1,100',
            'pares' => 'required|integer|between:1,100',
            'evaluaciondocente' => 'required|integer|between:1,100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $totalEvaluaciones = $request->autoevaluacion + $request->pares + $request->evaluaciondocente;

        if ($totalEvaluaciones > 100) {
            return response()->json([
                'message' => 'La suma de autoevaluación, evaluación de pares y evaluación del docente no debe superar 100.' .' Suma Total es: '. $totalEvaluaciones,
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($totalEvaluaciones < 100) {
            return response()->json([
                'message' => 'La suma de autoevaluación, evaluación de pares y evaluación del docente debe sumar 100.' .' Suma Total es: '. $totalEvaluaciones,
            ], Response::HTTP_BAD_REQUEST);
        }

        $planificacion = Planificacion::where('id_empresa', $request->empresa)
            ->first();

        if (!$planificacion) {
            return response()->json([
                'message' => 'Planificación no encontrada para la empresa proporcionada.',
            ], Response::HTTP_NOT_FOUND);
        }

        $sprint = Sprint::where('id_planificacion', $planificacion->id_planificacion)
            ->where('nro_sprint', $request->sprint)
            ->first();

        if (!$sprint) {
            return response()->json([
                'message' => 'Sprint no encontrado para la empresa proporcionada.',
            ], Response::HTTP_NOT_FOUND);
        }

        // Crear o actualizar la nota según el id_docente, id_sprint y id_empresa
        $nota = Nota::updateOrCreate(
            [
                'id_docente' => $docente->id_docente,
                'id_empresa' => $request->empresa,
                'id_sprint' => $sprint->id_sprint,
            ],
            [
                'autoevaluacion' => $request->autoevaluacion,
                'pares' => $request->pares,
                'evaluaciondocente' => $request->evaluaciondocente,
            ]
        );

        return response()->json([
            'message' => $nota->wasRecentlyCreated ? 'Nota creada correctamente.' : 'Nota actualizada correctamente.',
            'nota' => $nota,
        ], $nota->wasRecentlyCreated ? Response::HTTP_CREATED : Response::HTTP_OK);
    }


    public function destroy($id)
    {
        $nota = Nota::find($id);
        if (!$nota) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }
        $nota->delete();
        return response()->json(['message' => 'Nota eliminada correctamente']);
    }
}
