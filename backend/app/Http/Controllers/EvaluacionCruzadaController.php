<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cruzada;
use App\Models\Empresa;

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

    public function getEquiposConEstudiantesRecientes()
{
    try {
        // Supongo que tienes un campo 'gestion' en tu tabla de empresas o equipos
        $equipos = Empresa::with(['estudiantes' => function($query) {
            $query->where('gestion', '2-2024'); // Filtrar por gestión más reciente
        }])
        ->where('gestion', '2-2024') // Filtrar los equipos de la gestión más reciente
        ->get();

        if ($equipos->isEmpty()) {
            return response()->json(['message' => 'No se encontraron equipos en la gestión más reciente'], 404);
        }

        return response()->json($equipos, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al recuperar los equipos: ' . $e->getMessage()], 500);
    }
}
}
