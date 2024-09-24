<?php

namespace App\Http\Controllers;

use App\Imports\EstudiantesImport;
use App\Models\Estudiante;
use App\Models\RepresentateLegal;
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
        // Validar los datos
        $validatedData = $request->validate([
            'nombre_estudiante' => 'required|string|max:255',
            'ap_pat' => 'required|string|max:255',
            'ap_mat' => 'nullable|string|max:255',
            'codigo_sis' => 'required|digits:9|unique:estudiante,codigo_sis', // Asegúrate de usar el nombre correcto de la tabla
            'es_representante' => 'boolean',
        ]);

        $representanteId = null;

        // Si se indica que el estudiante es un representante, crear un nuevo representante
        if ($request->es_representante) {
            $representante = RepresentateLegal::create([
                'estado' => 1, // Puedes ajustar el estado según sea necesario
            ]);
            $representanteId = $representante->id_representante; // Obtener el ID del representante recién creado
        }

        // Crear el estudiante, asignando el ID del representante si existe
        $estudiante = Estudiante::create([
            'nombre_estudiante' => $request->nombre_estudiante,
            'ap_pat' => $request->ap_pat,
            'ap_mat' => $request->ap_mat,
            'codigo_sis' => $request->codigo_sis,
            'id_representante' => $representanteId, // Asignar el ID del representante
        ]);

        return response()->json($estudiante, 201); // Retornar el estudiante creado
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
            'es_representante' => 'boolean', // Validación para es_representante
        ]);

        try {
            $estudiante = Estudiante::where('id_estudiante', $id)->first();

            // Actualizar el estudiante con el nuevo id_representante
            $estudiante->update([
                'nombre_estudiante' => $request->input('nombre_estudiante'),
                'ap_pat' => $request->input('ap_pat'),
                'ap_mat' => $request->input('ap_mat'),
                'codigo_sis' => $request->input('codigo_sis'),
                'correo' => $request->input('correo'),
                'contrasenia' => $request->input('contrasenia') ? bcrypt($request->input('contrasenia')) : $estudiante->contrasenia,
                'id_representante' => $request->input('es_representante') ? 1 : null, // Asignar 1 o null según es_representante
            ]);

            return response()->json($estudiante, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el estudiante'], 500);
        }
    }

    // Eliminar un estudiante
    // Eliminar un estudiante y su representante
public function destroy($id)
{
    try {
        $estudiante = Estudiante::findOrFail($id);
        
        // Eliminar el estudiante
        $estudiante->delete();
        
        return response()->json(['message' => 'Estudiante y su representante eliminado exitosamente'], 200);
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
