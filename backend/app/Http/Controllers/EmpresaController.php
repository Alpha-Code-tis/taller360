<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\Planificacion;
use Illuminate\Http\Response;
use \Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EmpresaController extends Controller
{
    public function index()
    {
        return Empresa::with(['cantidad', 'representate_legal', 'planificacion'])->get();
    }
    public function getEstudiantesSinEmpresa()
    {
        try {
            $estudiantes = Estudiante::whereNull('id_empresa')->get();

            if ($estudiantes->isEmpty()) {
                return response()->json(['message' => 'No se encontraron estudiantes sin empresa'], 404);
            }

            return response()->json($estudiantes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al consultar los estudiantes: ' . $e->getMessage()], 500);
        }
    }



    public function getEstudiantesPorEmpresa($id_empresa)
    {
        try {
            // Verificar si la empresa existe
            $empresa = Empresa::find($id_empresa);
            if (!$empresa) {
                return response()->json(['message' => 'Empresa no encontrada'], 404);
            }
    
            // Obtener estudiantes que pertenecen a la empresa especificada
            $estudiantes = Estudiante::where('id_empresa', $id_empresa)->get();
    
            if ($estudiantes->isEmpty()) {
                return response()->json(['message' => 'No se encontraron estudiantes para esta empresa'], 404);
            }
    
            return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            // Manejar errores generales
            return response()->json(['error' => 'Error al consultar los estudiantes: ' . $e->getMessage()], 500);
        }
    }
    

    public function show($id_empresa)
    {
        try {
            // Busca la empresa por su ID
            $empresa = Empresa::with('estudiantes')->findOrFail($id_empresa);

            // Devuelve los datos de la empresa junto con los estudiantes
            return response()->json([
                'empresa' => [
                    'id_empresa' => $empresa->id_empresa,
                    'nombre_empresa' => $empresa->nombre_empresa,
                    'nombre_corto' => $empresa->nombre_corto,
                    'direccion' => $empresa->direccion,
                    'telefono' => $empresa->telefono,
                    'correo_empresa' => $empresa->correo_empresa,
                    'logo' => $empresa->logo, // Aquí está la URL completa del logo
                    'estudiantesSeleccionados' => $empresa->estudiantes->map(function($estudiante) {
                    return [
                        'id_estudiante' => $estudiante->id_estudiante,
                    ];
                }),
            ],
        ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al recuperar la empresa: ' . $e->getMessage()], 500);
        }
    }
    public function destroy($id_empresa)
    {
        try {
            // Buscar la empresa por ID
            $empresa = Empresa::findOrFail($id_empresa);

            // Eliminar todas las planificaciones relacionadas
            foreach ($empresa->planificacions as $planificacion) {
                // Eliminar cualquier otra relación asociada, como sprints
                // Si tienes una relación con sprints, elimínalos aquí
                // $planificacion->sprints()->delete();

                // Eliminar la planificación
                $planificacion->delete();
            }

            // Actualizar estudiantes para quitar la relación con la empresa
            $empresa->estudiantes()->update(['id_empresa' => null]);

            // Finalmente, eliminar la empresa
            $empresa->delete();

            return response()->json(['message' => 'Empresa y sus planificaciones eliminadas correctamente.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Empresa no encontrada.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar la empresa: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validator = Validator::make($request->all(), [
        'nombre_empresa' => 'required|string|unique:empresa,nombre_empresa', // Asegura que el nombre sea único
            'nombre_corto' => 'required|string',
            'direccion' => 'required|string',
            'telefono' => 'required|string',
            'correo_empresa' => 'required|email',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validar el logo
            'estudiantesSeleccionados' => 'nullable|array', // Aceptar el JSON de IDs de estudiantes
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Crear la empresa
        $empresa = Empresa::create([
            'nombre_empresa' => $request->nombre_empresa, // Ajusta el nombre de la propiedad
            'nombre_corto' => $request->nombre_corto,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'correo_empresa' => $request->correo_empresa,
            'logo' => $request->file('logo') ? $request->file('logo')->store('logos') : null,
        ]);

        // Crear la planificación
        $planificacion = Planificacion::create([
            'id_empresa' => $empresa->id_empresa,
            'cant_sprints' => 6,
        ]);

        // Actualizar estudiantes
        $estudiantesIds = $request->estudiantesSeleccionados;  // Recibir directamente el array
        if (is_array($estudiantesIds) && !empty($estudiantesIds)) {
            Estudiante::whereIn('id_estudiante', $estudiantesIds)->update(['id_empresa' => $empresa->id_empresa]);
        }

        return response()->json([
            'empresa' => $empresa,
            'planificacion' => $planificacion,
            'message' => 'Empresa y planificación creadas exitosamente.'
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validar los datos del request
        $request->validate([
            'nombre_empresa' => 'required|string|unique:empresa,nombre_empresa,' . $id . ',id_empresa', // Asegura que el nombre sea único, excepto el actual
            'nombre_corto' => 'required|string|max:100',
            'correo_empresa' => 'required|email',
            'telefono' => 'required|string',
            'direccion' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validación del logo
            'estudiantesSeleccionados' => 'nullable|array',  // Cambia para aceptar array
        ]);

        try {
            // Buscar la empresa usando el ID
            $empresa = Empresa::findOrFail($id);

            // Registros para verificar los datos originales
            Log::info('Datos originales de la empresa', ['empresa' => $empresa->toArray()]);

            // Mantener el logo existente si no se actualiza
            $logoPath = $empresa->logo;

            // Si se ha subido un nuevo logo, almacenar la nueva imagen y eliminar la anterior
            if ($request->hasFile('logo')) {
                if ($logoPath) {
                    Storage::disk('public')->delete($logoPath);
                }
                $logoPath = $request->file('logo')->store('logos', 'public');
            }

             // Actualizar los datos de la empresa
        $empresa->update([
            'nombre_empresa' => $request->nombre_empresa,
            'nombre_corto' => $request->nombre_corto,
            'correo_empresa' => $request->correo_empresa,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'logo' => $logoPath,
        ]);

        // Actualizar los estudiantes asignados
        $estudiantesIds = $request->estudiantesSeleccionados;
        if (is_array($estudiantesIds) && !empty($estudiantesIds)) {
            Estudiante::whereIn('id_estudiante', $estudiantesIds)->update(['id_empresa' => $empresa->id_empresa]);
        }

        return response()->json($empresa->fresh(), 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al actualizar la empresa: ' . $e->getMessage()], 500);
    }
}
}
