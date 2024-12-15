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
    public function index(Request $request)
    {
        $gestionActual = '2-2024'; // Gestión predeterminada
        $gestion = $request->input('gestion', $gestionActual); // Filtro de gestión

        // Filtrar equipos por gestión
        $equipos = Empresa::with(['cantidad', 'representate_legal', 'planificacion'])
            ->where('gestion', $gestion)
            ->get();

        if ($equipos->isEmpty()) {
            return response()->json(['message' => 'No se encontraron equipos para esta gestión'], 404);
        }

        return response()->json($equipos, 200);
    }


    public function gestiones()
    {
        $gestiones = Empresa::select('gestion')->distinct()->pluck('gestion');
        return response()->json($gestiones, Response::HTTP_OK);
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



    public function getEstudiantesPorEmpresa($id)
    {
        try {
            $empresa = Empresa::with('estudiantes')->find($id);

            if (!$empresa) {
                return response()->json(['message' => 'Empresa no encontrada'], 404);
            }

            return response()->json([
                'empresa' => $empresa, // Incluye la información completa de la empresa
                'estudiantes' => $empresa->estudiantes,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener estudiantes: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener los estudiantes'], 500);
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
                    'gestion' => $empresa->gestion,
                    'logo' => $empresa->logo, // Aquí está la URL completa del logo
                    'estudiantesSeleccionados' => $empresa->estudiantes->map(function ($estudiante) {
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
        $estudianteLogueado = Estudiante::findOrFail(auth()->id());
        if (!is_null($estudianteLogueado->id_empresa)) {
            return response()->json(['error' => 'Ya perteneces a una empresa. No puedes crear otra.'], 403);
        }
        // Validar los datos recibidos
        $validator = Validator::make($request->all(), [
            'nombre_empresa' => ['required','string','unique:empresa,nombre_empresa','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u',], // Asegura que el nombre sea único
            'nombre_corto' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
            'direccion' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ,.-]+$/u',],
            'telefono' => ['required','regex:/^\+?[0-9\s\-]+$/',],
            'correo_empresa' => 'required|email',
            'gestion' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
            'logo' => 'nullable|url', // Validar el logo
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
            'gestion' => $request->gestion,
            'correo_empresa' => $request->correo_empresa,
            'logo' => $request->logo,
        ]);
        // Crear la planificación
        $planificacion = Planificacion::create([
            'id_empresa' => $empresa->id_empresa,
            'cant_sprints' => 6,
        ]);

        $estudianteLogueado->update(['id_empresa' => $empresa->id_empresa]);

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
        $request->validate([
            'nombre_empresa' => ['required','string','unique:empresa,nombre_empresa,' . $id . ',id_empresa','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u',],
            'nombre_corto' => ['required','string','max:100','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u',],
            'correo_empresa' => 'required|email',
            'telefono' => ['required','regex:/^\+?[0-9\s\-]+$/',],
            'direccion' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ,.-]+$/u',],
            'logo' => 'nullable|url',
            'estudiantesSeleccionados' => 'nullable|array',
        ]);

        try {
            $empresa = Empresa::findOrFail($id);

            Log::info('Datos originales de la empresa', [
                'id_empresa' => $empresa->id_empresa,
                'nombre_empresa' => $empresa->nombre_empresa,
            ]);

            // Manejar el logo
            $logoPath = $empresa->logo;
            if ($request->hasFile('logo')) {
                if ($logoPath) {
                    Storage::disk('public')->delete($logoPath);
                }
                $logoPath = $request->file('logo')->store('logos', 'public');
            } elseif ($request->filled('logo')) {
                $logoPath = $request->logo;
            }

            // Actualizar empresa
            $empresa->update([
                'nombre_empresa' => $request->nombre_empresa,
                'nombre_corto' => $request->nombre_corto,
                'correo_empresa' => $request->correo_empresa,
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'gestion' => $request->gestion,
                'logo' => $logoPath,
            ]);

            // Actualizar estudiantes asignados
            $estudiantesIds = $request->estudiantesSeleccionados;
            Estudiante::where('id_empresa', $empresa->id_empresa)
                ->whereNotIn('id_estudiante', $estudiantesIds)
                ->update(['id_empresa' => null]);
            if (is_array($estudiantesIds) && !empty($estudiantesIds)) {
                Estudiante::whereIn('id_estudiante', $estudiantesIds)->update(['id_empresa' => $empresa->id_empresa]);
            }

            return response()->json($empresa->fresh(), 200);
        } catch (\Exception $e) {
            Log::error('Error al actualizar la empresa: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar la empresa'], 500);
        }
    }

    public function getEquiposConEvaluaciones($gestion)
    {
        try {
            // Obtener equipos de la gestión con evaluaciones cruzadas
            $equipos = Empresa::with(['planificacion.sprints.alcances.tareas', 'evaluacionesCruzadas'])
                ->where('gestion', $gestion)
                ->get();

            if ($equipos->isEmpty()) {
                return response()->json(['message' => 'No se encontraron equipos para esta gestión'], 404);
            }

            return response()->json($equipos, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener equipos y evaluaciones cruzadas: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener los equipos'], 500);
        }
    }
    public function getReporte($id_empresa, Request $request)
    {
        try {
            // Obtener el parámetro de gestión desde la solicitud
            $gestion = $request->input('gestion');

            // Consultar la empresa con sus relaciones
            $empresa = Empresa::with([
                'estudiantes',
                'planificacions.sprints.alcances.tareas',
                'evaluacionesCruzadas.evaluador',
                // Elimina 'criterios' si no hay relación
            ])->findOrFail($id_empresa);

            // Mapeo de datos
            return response()->json([
                'empresa' => [
                    'id_empresa' => $empresa->id_empresa,
                    'nombre_empresa' => $empresa->nombre_empresa,
                    'nombre_corto' => $empresa->nombre_corto,
                    'direccion' => $empresa->direccion,
                    'telefono' => $empresa->telefono,
                    'correo_empresa' => $empresa->correo_empresa,
                    'logo' => $empresa->logo,
                    'estudiantesSeleccionados' => $empresa->estudiantes->map(function ($estudiante) {
                        return [
                            'id_estudiante' => $estudiante->id_estudiante,
                            'nombre' => $estudiante->nombre_estudiante . ' ' . $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                        ];
                    }),
                    'planificaciones' => $empresa->planificacions->map(function ($planificacion) {
                        return [
                            'id_planificacion' => $planificacion->id_planificacion,
                            'sprints' => $planificacion->sprints->map(function ($sprint) {
                                return [
                                    'id_sprint' => $sprint->id_sprint,
                                    'nro_sprint' => $sprint->nro_sprint,
                                    'fecha_inicio' => $sprint->fecha_inicio,
                                    'fecha_fin' => $sprint->fecha_fin,
                                    'alcances' => $sprint->alcances->map(function ($alcance) {
                                        return [
                                            'id_alcance' => $alcance->id_alcance,
                                            'descripcion' => $alcance->descripcion,
                                            'tareas' => $alcance->tareas->map(function ($tarea) {
                                                return [
                                                    'id_tarea' => $tarea->id_tarea,
                                                    'nombre_tarea' => $tarea->nombre_tarea,
                                                    'estimacion' => $tarea->estimacion,
                                                ];
                                            }),
                                        ];
                                    }),
                                ];
                            }),
                        ];
                    }),
                    'evaluacionesCruzadas' => $empresa->evaluacionesCruzadas->map(function ($evaluacion) {
                        return [
                            'id_cruzada' => $evaluacion->id_cruzada,
                            'evaluator' => $evaluacion->evaluador->nombre_empresa ?? null,
                            'nota_cruzada' => $evaluacion->nota_cruzada,
                            'detalle_notas' => $evaluacion->detalle_notas,
                        ];
                    }),
                    // Si 'criterios' no está definido, elimínalo
                    // 'criterios' => $empresa->criterios->map(function ($criterio) {
                    //     return [
                    //         'id_criterio' => $criterio->id_criterio,
                    //         'nombre' => $criterio->nombre,
                    //     ];
                    // }),
                ],
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Error al obtener el reporte de la empresa: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener el reporte'], 500);
        }
    }
}
