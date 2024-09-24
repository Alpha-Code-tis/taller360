<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\Planificacion;
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

    public function show(Empresa $empresa)
    {
        return $empresa->load(['cantidad', 'representate_legal', 'planificacion']);
    }

    public function destroy(Empresa $empresa)
    {
        $empresa->delete();
        return response()->json(null, 204);
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
            'nombre_empresa' => $request->nombreEquipo, // Ajusta el nombre de la propiedad
            'nombre_corto' => $request->nombreCorto,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'correo_empresa' => $request->correoEmpresa,
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

    public function update(Request $request, Empresa $empresa)
    {
        $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'nombre_corto' => 'required|string|max:100',
            'correo_empresa' => 'required|email',
            'telefono' => 'required|string',
            'direccion' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validación del logo
        ]);

        $logoPath = $empresa->logo; // Mantiene la ruta existente

        if ($request->hasFile('logo')) {
            // Elimina la imagen anterior si es necesario
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public'); // Almacena el nuevo logo
        }

        $empresa->update($request->all() + ['logo' => $logoPath]);

        return response()->json($empresa, 200);
    }
}
