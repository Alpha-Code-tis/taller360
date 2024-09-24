<?php

namespace App\Http\Controllers;

use App\Imports\EstudiantesImport;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

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
            $estudiante = Estudiante::where('id_estudiante', $id)->first();
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
            'correo' => 'nullable|email|unique:estudiante,correo',
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
            'correo' => 'nullable|email|unique:estudiante,correo,' . $id . ',id_estudiante',
            'codigo_sis' => 'required|integer|unique:estudiante,codigo_sis,' . $id . ',id_estudiante',
        ]);

        try {
            $estudiante = Estudiante::where('id_estudiante', $id)->first();
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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        try {
            Excel::import(new EstudiantesImport, $request->file('file'));
            return response()->json(['success' => 'Estudiantes importados exitosamente.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al importar estudiantes: ' . $e->getMessage()], 500);
        }
    }
}
