<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\Planificacion;
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
            // Obtener estudiantes que pertenecen a la empresa especificada
            $estudiantes = Estudiante::where('id_empresa', $id_empresa)->get();

            if ($estudiantes->isEmpty()) {
                return response()->json(['message' => 'No se encontraron estudiantes para esta empresa'], 404);
            }

            return response()->json($estudiantes);
        } catch (\Exception $e) {
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
                    'estudiantesSeleccionados' => $empresa->estudiantes,
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
        $request->validate([
            'nombre_empresa' => 'required|string',
            'nombre_corto' => 'required|string',
            'direccion' => 'required|string',
            'telefono' => 'required|string',
            'correo_empresa' => 'required|email',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validar el logo
            'estudiantesSeleccionados' => 'nullable|string', // Aceptar el JSON de IDs de estudiantes
        ]);

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
        $estudiantesIds = json_decode($request->estudiantesSeleccionados);

        // Si $estudiantesIds es un arreglo, lo manejamos como tal
        if (is_array($estudiantesIds) && !empty($estudiantesIds)) {
            Estudiante::whereIn('id_estudiante', $estudiantesIds)->update(['id_empresa' => $empresa->id_empresa]);
        } elseif ($estudiantesIds) {
            // Si es un solo ID (no en arreglo)
            Estudiante::where('id_estudiante', $estudiantesIds)->update(['id_empresa' => $empresa->id_empresa]);
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
            'nombre_empresa' => 'required|string|max:255',
            'nombre_corto' => 'required|string|max:100',
            'correo_empresa' => 'required|email',
            'telefono' => 'required|string',
            'direccion' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validación del logo
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

            // Datos a actualizar
            $datosActualizados = [
                'nombre_empresa' => $request->input('nombre_empresa'),
                'nombre_corto' => $request->input('nombre_corto'),
                'correo_empresa' => $request->input('correo_empresa'),
                'telefono' => $request->input('telefono'),
                'direccion' => $request->input('direccion'),
                'logo' => $logoPath,
            ];

            // Comparar datos antes de la actualización
            Log::info('Datos a actualizar', ['datos' => $datosActualizados]);

            // Actualizar los datos de la empresa
            $actualizado = $empresa->update($datosActualizados);

            // Verificar si realmente se actualizó algo
            if ($actualizado) {
                // Si se actualizó, registrar los nuevos valores
                Log::info('Datos de la empresa después de la actualización', ['empresa_actualizada' => $empresa->fresh()->toArray()]);
                return response()->json($empresa->fresh(), 200); // Usar fresh() para obtener los datos actualizados
            } else {
                Log::warning('No se actualizaron los datos.');
                return response()->json(['error' => 'No se realizaron cambios en los datos de la empresa.'], 400);
            }
        } catch (\Exception $e) {
            // Manejo de errores
            Log::error('Error al actualizar la empresa', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al actualizar la empresa: ' . $e->getMessage()], 500);
        }
    }
}
