<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cruzada;

class EvaluacionCruzadaController extends Controller
{
    public function index()
    {
        // Obtener todas las evaluaciones cruzadas
        $evaluaciones = Cruzada::all();
        return response()->json($evaluaciones);
    }

    public function store(Request $request)
    {
        // Validar y guardar una nueva evaluación cruzada
        $evaluacion = Cruzada::create($request->all());
        return response()->json($evaluacion, 201);
    }

    public function show($id)
    {
        // Mostrar una evaluación cruzada específica
        $evaluacion = Cruzada::find($id);
        if (!$evaluacion) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        return response()->json($evaluacion);
    }

    public function update(Request $request, $id)
    {
        // Actualizar una evaluación cruzada
        $evaluacion = Cruzada::find($id);
        if (!$evaluacion) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        $evaluacion->update($request->all());
        return response()->json($evaluacion);
    }

    public function destroy($id)
    {
        // Eliminar una evaluación cruzada
        $evaluacion = Cruzada::find($id);
        if (!$evaluacion) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        $evaluacion->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
