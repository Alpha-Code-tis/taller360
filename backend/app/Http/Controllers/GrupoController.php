<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class GrupoController extends Controller
{
    public function index()
    {
        $grupos = Grupo::all();
        $gruposOcupados = Docente::pluck('id_grupo')->toArray();
        $gruposDisponibles = $grupos->filter(function($grupo) use ($gruposOcupados) {
            return !in_array($grupo->id_grupo, $gruposOcupados);
        });
        return response()->json($gruposDisponibles->values()->all());
    }

    public function show($id)
    {
        $grupo = Grupo::find($id);
        if ($grupo) {
            return response()->json($grupo);
        } else {
            return response()->json(['error' => 'Grupo no encontrado'], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validar que el grupo sea numérico y único
            $validatedData = $request->validate([
                'nro_grupo' => 'required|numeric|unique:grupo,nro_grupo|digits_between:1,10',
            ]);

            // Crear el grupo
            $grupo = Grupo::create($validatedData);
            return response()->json($grupo, 201);
        } catch (\Exception $e) {
            Log::error('Error al agregar el grupo: ' . $e->getMessage());
            return response()->json(['error' => 'Error al agregar el grupo'], 500);
        }
    }
        
    public function update(Request $request, $id)
    {
        $grupo = Grupo::find($id);

        if (!$grupo) {
            return response()->json(['error' => 'Grupo no encontrado'], 404);
        }

        // Validar que el grupo sea numérico, único (excepto para el mismo grupo) y de 1 a 10 dígitos
        $validatedData = $request->validate([
            'nro_grupo' => 'required|numeric|digits_between:1,10|unique:grupo,nro_grupo,' . $grupo->id_grupo,
        ]);

        // Actualizar el grupo
        $grupo->update($validatedData);
        return response()->json($grupo);
    }

    

    public function destroy($id)
    {
        $grupo = Grupo::find($id);

        if ($grupo) {
            $grupo->delete();
            return response()->json(['message' => 'Grupo eliminado']);
        } else {
            return response()->json(['error' => 'Grupo no encontrado'], 404);
        }
    }
}
