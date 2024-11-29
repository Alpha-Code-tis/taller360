<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Cruzada;
use App\Models\Criterio;
use App\Models\Empresa;
use Carbon\Carbon;
use App\Models\Ajuste;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class CruzadaController extends Controller
{
    // Obtener todas las empresas
    public function getEmpresas()
    {
        try {
            $empresas = Empresa::all();
            return response()->json($empresas, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener las empresas: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener las empresas'], 500);
        }
    }

    // Obtener estudiantes de una empresa específica
    public function getEstudiantesByEmpresa($id)
    {
        try {
            $empresa = Empresa::with('estudiantes')->find($id);

            if (!$empresa) {
                return response()->json(['message' => 'Empresa no encontrada'], 404);
            }

            return response()->json($empresa->estudiantes, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener estudiantes: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener los estudiantes'], 500);
        }
    }

    public function getEquiposCruzada()
{
    try {
        // Obtener el equipo al que pertenece el estudiante autenticado
        $user = Auth::user();

        if (!$user || !$user->id_empresa) {
            return response()->json(['message' => 'El usuario no pertenece a ningún equipo'], 400);
        }

        // Filtrar los equipos asignados para ser evaluados por el equipo del usuario
        $equipos = Cruzada::with('evaluado')
            ->where('equipo_evaluador_id', $user->id_empresa) // Filtrar por el equipo del usuario
            ->get()
            ->map(function ($cruzada) {
                return $cruzada->evaluado; // Retornar solo los equipos evaluados
            });

        return response()->json($equipos, 200);
    } catch (\Exception $e) {
        Log::error('Error al obtener los equipos para evaluar: ' . $e->getMessage());
        return response()->json(['message' => 'Error al obtener los equipos'], 500);
    }
}

    // Guardar una evaluación cruzada
    public function guardarEvaluacion(Request $request)
    {
        $validatedData = $request->validate([
            'equipo_evaluador_id' => 'required|exists:empresa,id_empresa',
            'equipo_evaluado_id' => 'required|exists:empresa,id_empresa|different:equipo_evaluador_id',
            'gestion' => 'required|string',
        ]);
        // Obtener los ajustes
    $ajustes = Ajuste::first();

    if (!$ajustes || !$ajustes->fecha_inicio_eva_cruzada || !$ajustes->fecha_fin_eva_cruzada) {
        return response()->json(['message' => 'Las fechas de evaluación cruzada no están configuradas.'], 400);
    }

    // Obtener la fecha actual
    $fechaActual = Carbon::now();

    // Verificar si la fecha actual está dentro del rango permitido
    if (
        $fechaActual->lt(Carbon::parse($ajustes->fecha_inicio_eva_cruzada)) ||
        $fechaActual->gt(Carbon::parse($ajustes->fecha_fin_eva_cruzada))
    ) {
        return response()->json([
            'message' => 'No está permitido realizar la evaluación cruzada en estas fechas.',
        ], 403);
    }

        try {
            // Verificar si ya existe una evaluación cruzada
            $exists = Cruzada::where('equipo_evaluador_id', $validatedData['equipo_evaluador_id'])
                ->where('equipo_evaluado_id', $validatedData['equipo_evaluado_id'])
                ->where('gestion', $validatedData['gestion'])
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Esta asignación ya existe'], 400);
            }

            // Crear la evaluación cruzada
            $cruzada = Cruzada::create($validatedData);

            return response()->json($cruzada, 201);
        } catch (\Exception $e) {
            Log::error('Error al guardar la evaluación cruzada: ' . $e->getMessage());
            return response()->json(['message' => 'Error al guardar la evaluación cruzada'], 500);
        }
    }

    // Obtener evaluaciones cruzadas por gestión
    public function obtenerEvaluaciones(Request $request)
    {
        $gestion = $request->query('gestion');

        if (!$gestion) {
            return response()->json(['message' => 'La gestión es requerida'], 400);
        }

        try {
            $evaluaciones = Cruzada::with(['evaluador', 'evaluado'])
                ->where('gestion', $gestion)
                ->get();

            return response()->json($evaluaciones, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener las evaluaciones cruzadas: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener las evaluaciones cruzadas'], 500);
        }
    }
    // Guardar enlace y especificaciones
    public function guardarDriveYEspecificaciones(Request $request)
{
    $validatedData = $request->validate([
        'drive_link' => 'required|url',
        'especificaciones' => 'nullable|string',
    ]);

    try {
        // Obtener al usuario autenticado
        $user = Auth::user();

        // Validar que el usuario tenga una empresa asociada
        if (!$user || !$user->id_empresa) {
            return response()->json(['message' => 'El usuario no tiene una empresa asociada'], 403);
        }

        $empresa = Empresa::findOrFail($user->id_empresa);

        // Actualizar los datos en la empresa del usuario
        $empresa->update([
            'drive_link' => $validatedData['drive_link'],
            'especificaciones' => $validatedData['especificaciones'],
        ]);

        return response()->json(['message' => 'Datos guardados correctamente'], 200);
    } catch (\Exception $e) {
        Log::error('Error al guardar el enlace de Drive y especificaciones: ' . $e->getMessage());
        return response()->json(['message' => 'Error al guardar los datos'], 500);
    }
}


public function obtenerDriveYEspecificaciones($empresaId)
{
    try {
        $empresa = Empresa::findOrFail($empresaId);
        $criterios = Criterio::all(); // Suponiendo que todos los criterios son globales

        // Validar que los criterios tengan porcentaje mayor a 0
        $criterios = $criterios->map(function ($criterio) {
            $criterio->porcentaje = $criterio->porcentaje > 0 ? $criterio->porcentaje : 0;
            return $criterio;
        });

        return response()->json([
            'drive_link' => $empresa->drive_link,
            'especificaciones' => $empresa->especificaciones,
            'criterios' => $criterios,
        ], 200);
    } catch (\Exception $e) {
        Log::error('Error al obtener los datos: ' . $e->getMessage());
        return response()->json(['message' => 'Error al obtener los datos'], 500);
    }
}

public function guardarNotaCruzada(Request $request)
{
    try {
        // Obtener el usuario autenticado y su empresa
        $user = Auth::user();

        if (!$user || !$user->id_empresa) {
            return response()->json(['message' => 'El usuario no pertenece a ninguna empresa'], 400);
        }

        // Validar los datos de entrada
        $validated = $request->validate([
            'equipo_evaluado_id' => 'required|exists:empresa,id_empresa',
            'nota_cruzada' => 'required|numeric|min:0|max:100',
            'detalle_notas' => 'required|array',
            'detalle_notas.*.id_criterio' => 'required|integer|exists:criterios,id_criterio',
            'detalle_notas.*.nota' => 'required|numeric|min:0',
        ]);

        // Buscar la cruzada
        $cruzada = Cruzada::where('equipo_evaluador_id', $user->id_empresa)
            ->where('equipo_evaluado_id', $validated['equipo_evaluado_id'])
            ->firstOrFail();

        // Guardar la nota total y el detalle de notas
        $cruzada->nota_cruzada = $validated['nota_cruzada'];
        $cruzada->detalle_notas = $validated['detalle_notas'];
        $cruzada->save();

        return response()->json(['message' => 'Nota guardada correctamente'], 200);
    } catch (ValidationException $e) {
        Log::error('Errores de validación: ' . json_encode($e->errors()));
        return response()->json(['message' => 'Datos inválidos', 'errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        Log::error('Error al guardar la nota cruzada: ' . $e->getMessage());
        return response()->json(['message' => 'Error al guardar la nota'], 500);
    }
}

public function obtenerNotas($idEmpresa)
{
    try {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar si el usuario pertenece a una empresa
        if (!$user || !$user->id_empresa) {
            return response()->json(['message' => 'El usuario no pertenece a ninguna empresa'], 400);
        }

        // Buscar la cruzada donde el equipo del usuario fue evaluador y el equipo evaluado es $idEmpresa
        $cruzada = Cruzada::where('equipo_evaluador_id', $user->id_empresa)
            ->where('equipo_evaluado_id', $idEmpresa)
            ->first();

        if (!$cruzada || $cruzada->detalle_notas === null) {
            return response()->json(['message' => 'No hay notas disponibles para este equipo'], 404);
        }

        // Obtener los detalles de las notas y los nombres de los criterios
        $notasDetalle = collect($cruzada->detalle_notas)->map(function ($detalle) {
            $criterio = Criterio::find($detalle['id_criterio']);
            return [
                'criterio_nombre' => $criterio ? $criterio->nombre : 'Criterio desconocido',
                'nota' => $detalle['nota'],
            ];
        });

        return response()->json($notasDetalle, 200);
    } catch (\Exception $e) {
        Log::error('Error al obtener las notas: ' . $e->getMessage());
        return response()->json(['message' => 'Error al obtener las notas'], 500);
    }
}


public function obtenerMisNotas()
{
    try {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar si el usuario pertenece a una empresa
        if (!$user || !$user->id_empresa) {
            return response()->json(['message' => 'El usuario no pertenece a ninguna empresa'], 400);
        }

        // Buscar todas las evaluaciones donde el equipo del usuario es el evaluado
        $cruzadas = Cruzada::where('equipo_evaluado_id', $user->id_empresa)
            ->whereNotNull('detalle_notas') // Asegurarse de que hay notas
            ->get();

        if ($cruzadas->isEmpty()) {
            return response()->json(['message' => 'No hay notas disponibles para tu equipo'], 404);
        }

        // Preparar las notas detalladas
        $notasDetalle = [];

        foreach ($cruzadas as $cruzada) {
            $evaluador = Empresa::find($cruzada->equipo_evaluador_id);
            $detalles = collect($cruzada->detalle_notas)->map(function ($detalle) {
                $criterio = Criterio::find($detalle['id_criterio']);
                return [
                    'criterio_nombre' => $criterio ? $criterio->nombre : 'Criterio desconocido',
                    'nota' => $detalle['nota'],
                ];
            });

            $notasDetalle[] = [
                'evaluador' => $evaluador ? $evaluador->nombre_empresa : 'Evaluador desconocido',
                'detalles' => $detalles,
                'nota_total' => $cruzada->nota_cruzada,
            ];
        }

        return response()->json($notasDetalle, 200);
    } catch (\Exception $e) {
        Log::error('Error al obtener las notas: ' . $e->getMessage());
        return response()->json(['message' => 'Error al obtener las notas'], 500);
    }
}


}







