<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    // Mostrar todos los estudiantes
    public function index()
    {
        try {
            $estudiantes = Estudiante::all();
            return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los estudiantes'], 500);
        }
    }

    // Mostrar un estudiante específico
    public function show($id)
    {
        try {
            $estudiante = Estudiante::findOrFail($id);
            return response()->json($estudiante, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        }
    }

    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        $this->validate($request, [
            'nombre_estudiante' => 'required|string|max:255',
            'ap_pat' => 'required|string|max:255',
            'ap_mat' => 'nullable|string|max:255',
            'correo' => 'required|email|unique:estudiante,correo',
            'codigo_sis' => 'required|integer|unique:estudiante,codigo_sis',
        ]);

        try {
            $estudiante = Estudiante::create([
                'nombre_estudiante' => $request->input('nombre_estudiante'),
                'ap_pat' => $request->input('ap_pat'),
                'ap_mat' => $request->input('ap_mat'),
                'codigo_sis' => $request->input('codigo_sis'),
                'correo' => $request->input('correo'),
                'contrasenia' => bcrypt($request->input('contrasenia')),
            ]);

            return response()->json($estudiante, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear el estudiante'], 500);
        }
    }

    // Actualizar un estudiante existente
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'nombre_estudiante' => 'required|string|max:255',
            'ap_pat' => 'required|string|max:255',
            'ap_mat' => 'nullable|string|max:255',
            'correo' => 'required|email|unique:estudiante,correo,' . $id,
            'codigo_sis' => 'required|integer|unique:estudiante,codigo_sis,' . $id,
        ]);

        try {
            $estudiante = Estudiante::findOrFail($id);
            $estudiante->update([
                'nombre_estudiante' => $request->input('nombre_estudiante'),
                'ap_pat' => $request->input('ap_pat'),
                'ap_mat' => $request->input('ap_mat'),
                'codigo_sis' => $request->input('codigo_sis'),
                'correo' => $request->input('correo'),
                'contrasenia' => $request->input('contrasenia') ? bcrypt($request->input('contrasenia')) : $estudiante->contrasenia,
            ]);

            return response()->json($estudiante, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el estudiante'], 500);
        }
    }

    // Eliminar un estudiante
    public function destroy($id)
    {
        try {
            $estudiante = Estudiante::findOrFail($id);
            $estudiante->delete();
            return response()->json(['message' => 'Estudiante eliminado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el estudiante'], 500);
        }
    }
}