<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Grupo;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    // Mostrar todos los grupos
    public function index()
    {
        // Obtener todos los grupos
        $grupos = Grupo::all();

        // Obtener los grupos que ya están asignados a docentes
        $gruposOcupados = Docente::pluck('id_grupo')->toArray();

        // Filtrar los grupos que no están en uso
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
        $validatedData = $request->validate([
            'nro_grupo' => 'nullable|string|max:10',
        ]);

        $grupo = Grupo::create($validatedData);
        return response()->json($grupo, 201);
    }

    public function update(Request $request, $id)
    {
        $grupo = Grupo::find($id);

        if (!$grupo) {
            return response()->json(['error' => 'Grupo no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'nro_grupo' => 'nullable|string|max:10',
        ]);

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
