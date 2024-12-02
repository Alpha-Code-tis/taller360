<?php

namespace App\Http\Controllers;

use App\Models\Nota;
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
    public function show()
    {
        $docente = auth()->guard('sanctum')->user();
    
        // Buscar las notas asociadas al docente autenticado
        $nota = Nota::where('id_docente', $docente->id_docente)->first();
    
        if ($nota) {
            return response()->json($nota);
        }
    
        return response()->json(['message' => 'Nota no encontrada'], 404);
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

        return response()->json($nota, 201);
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
            'autoevaluacion' => 'required|integer',
            'pares' => 'required|integer',
            'evaluaciondocente' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Crear o actualizar la nota según el id_docente
        $nota = Nota::updateOrCreate(
            ['id_docente' => $docente->id_docente], // Criterio de búsqueda
            [
                'autoevaluacion' => $request->autoevaluacion,
                'pares' => $request->pares,
                'evaluaciondocente' => $request->evaluaciondocente,
            ]
        );

        return response()->json($nota, $nota->wasRecentlyCreated ? 201 : 200);
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
