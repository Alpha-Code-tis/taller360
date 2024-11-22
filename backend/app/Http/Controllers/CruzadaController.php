<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cruzada;
use App\Models\Estudiante;
use App\Models\Tarea;
use App\Models\Empresa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CruzadaController extends Controller
{

    // Obtener todas las empresas
    public function getEmpresas()
    {
        $empresas = Empresa::all();
        return response()->json($empresas);
    }

    // Obtener estudiantes de una empresa específica
    public function getEstudiantesByEmpresa($id)
    {
        $empresa = Empresa::with('estudiantes')->find($id);
        
        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        return response()->json($empresa->estudiantes);
    }
    // Obtener todas las evaluaciones cruzadas
    public function index()
    {
        try {
            // Obtener todas las evaluaciones cruzadas junto con las tareas y estudiantes
            $cruzadas = Cruzada::with(['tarea.estudiantes'])->get();
            return response()->json($cruzadas, 200);
        } catch (\Exception $e) {
            Log::error("Error en CruzadaController@index: " . $e->getMessage());
            return response()->json(['error' => 'Error al obtener las evaluaciones cruzadas'], 500);
        }
    }

    // Obtener detalles de una cruzada específica
    public function show($id)
    {
        try {
            $cruzada = Cruzada::with(['tarea.estudiantes'])->findOrFail($id);
            return response()->json($cruzada, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Evaluación cruzada no encontrada'], 404);
        } catch (\Exception $e) {
            Log::error("Error en CruzadaController@show: " . $e->getMessage());
            return response()->json(['error' => 'Error al obtener la evaluación cruzada'], 500);
        }
    }

    // Evaluar a un estudiante en una tarea específica dentro de la evaluación cruzada
    public function evaluarEstudiante(Request $request, $cruzadaId, $estudianteId)
    {
        $request->validate([
            'nota' => 'required|integer|min:0|max:100',
            'comentarios' => 'nullable|string|max:500',
        ]);

        try {
            $cruzada = Cruzada::findOrFail($cruzadaId);
            $estudiante = Estudiante::findOrFail($estudianteId);
            
            // Obtener la tarea asociada con la evaluación cruzada y estudiante
            $tarea = Tarea::whereHas('cruzada', function ($query) use ($cruzadaId) {
                $query->where('id_cruzada', $cruzadaId);
            })->whereHas('estudiantes', function ($query) use ($estudianteId) {
                $query->where('id_estudiante', $estudianteId);
            })->firstOrFail();

            // Guardar la evaluación
            $tarea->estudiantes()->updateExistingPivot($estudiante->id_estudiante, [
                'resultado_evaluacion' => $request->input('nota'),
                'descripcion_evaluacion' => $request->input('comentarios'),
            ]);

            return response()->json(['message' => 'Evaluación guardada correctamente'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Cruzada o estudiante no encontrados'], 404);
        } catch (\Exception $e) {
            Log::error("Error en CruzadaController@evaluarEstudiante: " . $e->getMessage());
            return response()->json(['error' => 'Error al guardar la evaluación'], 500);
        }
    }

    // Obtener el historial de evaluaciones de un estudiante en todas las evaluaciones cruzadas
    public function historialEvaluacionesEstudiante($estudianteId)
    {
        try {
            $estudiante = Estudiante::with(['tarea' => function ($query) {
                $query->withPivot('resultado_evaluacion', 'descripcion_evaluacion');
            }])->findOrFail($estudianteId);

            return response()->json($estudiante, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        } catch (\Exception $e) {
            Log::error("Error en CruzadaController@historialEvaluacionesEstudiante: " . $e->getMessage());
            return response()->json(['error' => 'Error al obtener el historial de evaluaciones del estudiante'], 500);
        }
    }
}
