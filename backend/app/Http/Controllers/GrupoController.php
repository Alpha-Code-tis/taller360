<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Grupo;
use Illuminate\Http\Request;

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
        $validatedData = $request->validate([
            'nro_grupo' => 'required|numeric|unique:grupos,nro_grupo|max:10',
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
            'nro_grupo' => 'required|numeric|unique:grupos,nro_grupo,' . $grupo->id . '|max:10',
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
