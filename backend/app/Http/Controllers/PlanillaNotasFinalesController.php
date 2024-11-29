<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\NotaFinal;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\Cruzada;
use App\Models\NotasSprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanillaNotasFinalesController extends Controller
{
    public function getEquipos()
    {
        // Obtener el docente autenticado o un docente de prueba
        $docente = Auth::user();

        // Verificar si el docente está autenticado
        if (!$docente) {
            return response()->json([
                'error' => 'Docente no autenticado.'
            ], 401);
        }

        $empresas = Estudiante::whereNotNull('id_empresa')
            ->where('id_grupo', $docente->id_grupo)
            ->pluck('id_empresa')
            ->unique();

        // Verificar si hay empresas asociadas
        if ($empresas->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron empresas para este docente.'
            ], 404);
        }
        $detallesEmpresas = Empresa::whereIn('id_empresa', $empresas)->get();

        // Retornar las empresas en formato JSON
        return response()->json([
            'empresas' => $detallesEmpresas
        ]);
    }

    // Obtener estudiantes de una empresa con sus notas finales
    public function getEstudiantesConNotas($empresaId)
    {
        // Obtener estudiantes asociados a la empresa seleccionada
        $estudiantes = Estudiante::where('id_empresa', $empresaId)->get();

        // Crear una estructura para almacenar las notas por estudiante
        $notasEstudiantes = [];

        foreach ($estudiantes as $estudiante) {
            // Obtener las notas del sprint del estudiante
            $notasSprint = NotasSprint::whereHas('tarea', function ($query) use ($estudiante) {
                $query->whereHas('estudiantes', function ($subQuery) use ($estudiante) {
                    // Especificar el nombre de la tabla para evitar ambigüedad
                    $subQuery->where('estudiante.id_estudiante', $estudiante->id_estudiante);
                });
            })->get();

            // Calcular la nota total del sprint
            $notaTotalSprint = $notasSprint->sum('nota_tarea');

            // Obtener la cruzada correspondiente al equipo de la empresa seleccionada
            $cruzada = Cruzada::where('equipo_evaluado_id', $empresaId)->first();
            $notaCruzada = $cruzada ? $cruzada->nota_cruzada : 0;

            // Crear o actualizar la nota final
            $notaFinal = NotaFinal::updateOrCreate(
                [
                    'id_notas_sprint' => $notasSprint->first()->id_notas_sprint ?? null,
                ],
                [
                    'nota_total_sprint' => $notaTotalSprint,
                    'notas_cruzada' => $notaCruzada,
                    'nota_fin' => 0, // Se calculará después con los valores
                ]
            );

            // Guardar los datos del estudiante con sus notas
            $notasEstudiantes[] = [
                'nombre' => $estudiante->nombre_estudiante,
                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'notaTotalSprint' => $notaTotalSprint,
                'notaCruzada' => $notaCruzada,
                'notaFin' => $notaFinal->nota_fin,
            ];
        }

        return response()->json($notasEstudiantes);
    }


    // Actualizar las notas finales con los valores editables
    public function actualizarNotasFinales(Request $request, $empresaId)
    {
        $validatedData = $request->validate([
            'nota_valor_sprint' => 'required|numeric',
            'nota_valor_cruzada' => 'required|numeric',
        ]);

        $notaValorSprint = $validatedData['nota_valor_sprint'];
        $notaValorCruzada = $validatedData['nota_valor_cruzada'];

        // Verificar que la suma de los valores no exceda 100
        if (($notaValorSprint + $notaValorCruzada) > 100) {
            return response()->json([
                'error' => 'La suma de Nota Sprint y Evaluación Cruzada no debe superar 100.'
            ], 400);
        }

        // Obtener estudiantes asociados a la empresa seleccionada
        $estudiantes = Estudiante::where('id_empresa', $empresaId)->get();

        if ($estudiantes->isEmpty()) {
            return response()->json(['message' => 'No se encontraron estudiantes para esta empresa.'], 404);
        }

        foreach ($estudiantes as $estudiante) {
            // Obtener las notas del sprint del estudiante
            $notasSprint = NotasSprint::whereHas('tarea', function ($query) use ($estudiante) {
                $query->whereHas('estudiantes', function ($subQuery) use ($estudiante) {
                    $subQuery->where('id_estudiante', $estudiante->id_estudiante);
                });
            })->get();

            // Calcular la nota total del sprint y aplicar el porcentaje
            $notaTotalSprint = $notasSprint->sum('nota_tarea');
            $notaValorSprintFinal = ($notaTotalSprint * $notaValorSprint) / 100;

            // Obtener la cruzada correspondiente al equipo de la empresa seleccionada
            $cruzada = Cruzada::where('equipo_evaluado_id', $empresaId)->first();
            $notaCruzada = $cruzada ? $cruzada->nota_cruzada : 0;
            $notaValorCruzadaFinal = ($notaCruzada * $notaValorCruzada) / 100;

            // Calcular la nota final
            $notaFinal = $notaValorSprintFinal + $notaValorCruzadaFinal;

            // Actualizar la nota final en la base de datos
            NotaFinal::updateOrCreate(
                [
                    'id_notas_sprint' => $notasSprint->first()->id_notas_sprint ?? null,
                ],
                [
                    'nota_total_sprint' => $notaTotalSprint,
                    'notas_cruzada' => $notaCruzada,
                    'nota_fin' => $notaFinal,
                    'nota_valor_sprint' => $notaValorSprint,
                    'nota_valor_cruzada' => $notaValorCruzada,
                ]
            );
        }

        return response()->json(['message' => 'Notas finales actualizadas correctamente.'], 200);
    }
}
