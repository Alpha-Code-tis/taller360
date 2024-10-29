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
            'id_criterio' => 'required|string|max:255|unique:criterios,id_criterio', // Validar id_criterio
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'ponderacion' => 'required|integer|min:0|max:100',
        ]);

        $criterio = Criterio::create($request->all());

        return response()->json([
            'message' => 'Criterio creado con éxito.',
            'data' => $criterio
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
            'ponderacion' => 'required|integer|min:0|max:100',
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
