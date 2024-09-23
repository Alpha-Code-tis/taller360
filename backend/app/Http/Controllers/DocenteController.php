<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    // Mostrar todos los docentes
    public function index()
{
    $docentes = Docente::with('grupo')->get(); // Incluir el grupo relacionado
    return response()->json($docentes);
}

    // Mostrar un docente en específico
    public function show($id)
    {
        $docente = Docente::find($id);

        if ($docente) {
            return response()->json($docente);
        } else {
            return response()->json(['error' => 'Docente no encontrado'], 404);
        }
    }

    // Crear un nuevo docente
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_grupo' => 'nullable|integer',
            'nombre_docente' => 'nullable|string|max:35',
            'ap_pat' => 'nullable|string|max:35',
            'ap_mat' => 'nullable|string|max:35',
            'contrasenia' => 'nullable|string|max:64',
            'correo' => 'nullable|string|email|max:50',
        ]);

        $docente = Docente::create($validatedData);
        return response()->json($docente, 201);
    }

    // Actualizar un docente existente
    public function update(Request $request, $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json(['error' => 'Docente no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'id_grupo' => 'nullable|integer',
            'nombre_docente' => 'nullable|string|max:35',
            'ap_pat' => 'nullable|string|max:35',
            'ap_mat' => 'nullable|string|max:35',
            'contrasenia' => 'nullable|string|max:64',
            'correo' => 'nullable|string|email|max:50',
        ]);

        $docente->update($validatedData);
        return response()->json($docente);
    }

    // Eliminar un docente
    public function destroy($id)
    {
        $docente = Docente::find($id);

        if ($docente) {
            $docente->delete();
            return response()->json(['message' => 'Docente eliminado']);
        } else {
            return response()->json(['error' => 'Docente no encontrado'], 404);
        }
    }
}
