<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use App\Models\Tarea;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class CriterioController extends Controller
{
    // Obtener todos los criterios
    public function index()
    {
        $criterios = Criterio::with('subcriterios')->get();
        return response()->json($criterios, Response::HTTP_OK);
    }

    // Almacenar un nuevo criterio
    public function store(Request $request)
    {
        // Definir reglas de validación para los datos del criterio y subcriterios
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:criterios,nombre',
            'porcentaje' => 'required|integer|min:0|max:100',
            'subcriterios' => 'array',
            'subcriterios.*.descripcion' => 'required|string|max:255',
            'subcriterios.*.porcentaje' => 'required|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $totalPorcentajeSubcriterios = collect($request->subcriterios)->sum('porcentaje');
        if ($totalPorcentajeSubcriterios > $request->porcentaje) {
            return response()->json([
                'message' => 'La suma de los porcentajes de subcriterios no puede superar el porcentaje del criterio.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $criterio = Criterio::create([
            'nombre' => $request->nombre,
            'porcentaje' => $request->porcentaje,
        ]);
        if ($request->has('subcriterios')) {
            foreach ($request->subcriterios as $subcriterioData) {
                $criterio->subcriterios()->create($subcriterioData);
            }
        }
        return response()->json([
            'message' => 'Criterio y subcriterios creados con éxito.',
            'data' => $criterio->load('subcriterios') // Carga los subcriterios para mostrarlos en la respuesta
        ], Response::HTTP_CREATED);
    }

    // Mostrar un criterio específico
    public function show($id_criterio)
    {
        $criterio = Criterio::with('subcriterios')->where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json($criterio, Response::HTTP_OK);
    }

    // Actualizar un criterio existente
    public function update(Request $request, $id_criterio)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:criterios,nombre,' . $id_criterio . ',id_criterio',
            'porcentaje' => 'required|integer|min:0|max:100',
            'subcriterios' => 'array',
            'subcriterios.*.id_subcriterios' => 'sometimes|exists:subcriterios,id_subcriterios',
            'subcriterios.*.descripcion' => 'required|string|max:255',
            'subcriterios.*.porcentaje' => 'required|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $criterio = Criterio::with('subcriterios')->where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.'
            ], Response::HTTP_NOT_FOUND);
        }

        $criterio->update($request->only(['nombre', 'porcentaje']));

        if ($request->has('subcriterios')) {
            $totalPorcentajeSubcriterios = collect($request->subcriterios)->sum('porcentaje');
            if ($totalPorcentajeSubcriterios > $request->porcentaje) {
                return response()->json([
                    'message' => 'La suma de los porcentajes de subcriterios no puede superar el porcentaje del criterio.'
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            $existingSubcriterios = $criterio->subcriterios->keyBy('id_cri');
            foreach ($request->subcriterios as $subcriterioData) {
                if (isset($subcriterioData['id']) && $existingSubcriterios->has($subcriterioData['id'])) {
                    $existingSubcriterios[$subcriterioData['id']]->update($subcriterioData);
                    $existingSubcriterios->forget($subcriterioData['id']);
                } else {
                    $criterio->subcriterios()->create($subcriterioData);
                }
            }

            foreach ($existingSubcriterios as $subcriterio) {
                $subcriterio->delete();
            }
        }

        return response()->json([
            'message' => 'Criterio y subcriterios actualizados con éxito.',
            'data' => $criterio->load('subcriterios')
        ], Response::HTTP_OK);
    }

    // Eliminar un criterio junto con sus subcriterios
    public function destroy($id_criterio)
    {
        $criterio = Criterio::with('subcriterios')->where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.'
            ], Response::HTTP_NOT_FOUND);
        }

        $criterio->subcriterios()->delete();
        $criterio->delete();

        return response()->json([
            'message' => 'Criterio y sus subcriterios eliminados con éxito.'
        ], Response::HTTP_OK);
    }

    public function criteriosPorTarea($tareaId)
    {
        // Verificar que la tarea existe (opcional, si tienes un modelo Tarea)
        // Puedes omitir esto si no es necesario
        
        $tarea = Tarea::find($tareaId);
        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], Response::HTTP_NOT_FOUND);
        }
        

        // Obtener los criterios asociados a la tarea
        $criterios = Criterio::where('tarea_id', $tareaId)->get();

        if ($criterios->isEmpty()) {
            return response()->json(['message' => 'No hay criterios para esta tarea.'], Response::HTTP_OK);
        }

        return response()->json($criterios, Response::HTTP_OK);
    }
}
