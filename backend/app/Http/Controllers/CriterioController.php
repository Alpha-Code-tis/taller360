<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class CriterioController extends Controller
{
    // Obtener todos los criterios
    public function index()
    {
        $criterios = Criterio::all();
        return response()->json($criterios, Response::HTTP_OK);
    }

    // Almacenar un nuevo criterio
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'porcentaje' => 'required|integer|min:0|max:100',
            'subcriterios' => 'array',
            'subcriterios.*.descripcion' => 'required|string|max:255',
            'subcriterios.*.porcentaje' => 'required|integer|min:0|max:100',
        ]);
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
        $criterio = Criterio::where('id_criterio', $id_criterio)->first();

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
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'porcentaje' => 'required|integer|min:0|max:100',
        ]);

        $criterio = Criterio::where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.'
            ], Response::HTTP_NOT_FOUND);
        }

        $criterio->update($request->all());

        return response()->json([
            'message' => 'Criterio actualizado con éxito.',
            'data' => $criterio
        ], Response::HTTP_OK);
    }

    // Eliminar un criterio
    public function destroy($id_criterio)
    {
        $criterio = Criterio::where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.'
            ], Response::HTTP_NOT_FOUND);
        }

        $criterio->delete();

        return response()->json([
            'message' => 'Criterio eliminado con éxito.'
        ], Response::HTTP_NO_CONTENT);
    }
}
