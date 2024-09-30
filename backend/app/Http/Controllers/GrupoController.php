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
        $grupos = Grupo::all();
        return response()->json($grupos);
    }

    // Mostrar un grupo en específico
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
            'nro_grupo' => 'nullable|numeric|max:10',  // Changed to numeric
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
            'nro_grupo' => 'nullable|numeric|max:10',  // Changed to numeric
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
