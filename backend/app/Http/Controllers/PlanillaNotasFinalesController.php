<?php

namespace App\Http\Controllers;

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
        // Obtener el docente autenticado
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
    public function getEstudiantesConNotas(Request $request, $empresaId)
    {
        // Obtener los valores de nota_valor_sprint y nota_valor_cruzada desde el request
        $notaValorSprint = $request->input('nota_valor_sprint', 0); // Valor predeterminado 0
        $notaValorCruzada = $request->input('nota_valor_cruzada', 0); // Valor predeterminado 0

        // Validar que sean numéricos y que la suma no exceda 100
        if (!is_numeric($notaValorSprint) || !is_numeric($notaValorCruzada)) {
            return response()->json([
                'error' => 'Los valores de Nota Sprint y Evaluación Cruzada deben ser numéricos.'
            ], 400);
        }

        if (($notaValorSprint + $notaValorCruzada) == 101) {
            return response()->json([
                'error' => 'La suma de Nota Sprint y Evaluación Cruzada no debe superar 100.'
            ], 400);
        }

        // Obtener estudiantes asociados a la empresa seleccionada
        $estudiantes = Estudiante::where('id_empresa', $empresaId)->get();

        if ($estudiantes->isEmpty()) {
            return response()->json([
                'estudiantes' => [],
                'numSprints' => 0
            ]);
        }

        $notasEstudiantes = [];
        $maxNumSprints = 0;

        foreach ($estudiantes as $estudiante) {
            // Obtener las notas de sprint del estudiante
            $notasSprint = NotasSprint::where('id_estudiante', $estudiante->id_estudiante)->get();

            // Contar el número de sprints
            $numSprints = $notasSprint->count();
            if ($numSprints > $maxNumSprints) {
                $maxNumSprints = $numSprints;
            }

            // Obtener las notas de cada sprint
            $sprintsNotas = [];
            foreach ($notasSprint as $notaSprint) {
                $sprintId = $notaSprint->id_sprint;
                $sprintsNotas['sprint' . $sprintId] = $notaSprint->nota_total;
            }

            // Calcular la nota total del sprint
            $notaTotalSprint = $notasSprint->sum('nota_total');

            // Calcular nota_total_sprint ajustada
            $notaTotalSprintAjustada = ($notaTotalSprint * $notaValorSprint) / 100;

            // Obtener la nota cruzada correspondiente al equipo de la empresa seleccionada
            $cruzada = Cruzada::where('equipo_evaluado_id', $empresaId)->first();
            $notaCruzada = $cruzada ? $cruzada->nota_cruzada : 0;

            // Calcular notas_cruzada ajustada
            $notaCruzadaAjustada = ($notaCruzada * $notaValorCruzada) / 100;

            // Calcular la nota final
            $notaFin = $notaTotalSprintAjustada + $notaCruzadaAjustada;

            // Guardar los datos del estudiante con sus notas
            $notasEstudiantes[] = [
                'nombre' => $estudiante->nombre_estudiante,
                'apellidos' => $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'sprints' => $sprintsNotas,
                'notaTotalSprint' => $notaTotalSprint,
                'notaTotalSprintAjustada' => $notaTotalSprintAjustada,
                'notaCruzada' => $notaCruzada,
                'notaCruzadaAjustada' => $notaCruzadaAjustada,
                'notaFin' => $notaFin,
            ];

            $notaFinal = NotaFinal::where('id_estudiante', $estudiante->id_estudiante)->first();
            if ($notaFinal) {
                $notaFinal->update([
                    'nota_total_sprint' => $notaTotalSprint,
                    'nota_total_sprint_ajustada' => $notaTotalSprintAjustada,
                    'notas_cruzada' => $notaCruzada,
                    'notas_cruzada_ajustada' => $notaCruzadaAjustada,
                    'nota_fin' => $notaFin,
                    'nota_valor_sprint' => $notaValorSprint,
                    'nota_valor_cruzada' => $notaValorCruzada,
                ]);
            } else {
                $notaFinal = NotaFinal::create([
                    'id_estudiante' => $estudiante->id_estudiante,
                    'nota_total_sprint' => $notaTotalSprint,
                    'nota_total_sprint_ajustada' => $notaTotalSprintAjustada,
                    'notas_cruzada' => $notaCruzada,
                    'notas_cruzada_ajustada' => $notaCruzadaAjustada,
                    'nota_fin' => $notaFin,
                    'nota_valor_sprint' => $notaValorSprint,
                    'nota_valor_cruzada' => $notaValorCruzada,
                ]);
            }
        }

        return response()->json([
            'estudiantes' => $notasEstudiantes,
            'numSprints' => $maxNumSprints
        ]);
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
            $notasSprint = NotasSprint::where('id_estudiante', $estudiante->id_estudiante)->get();

            $numSprints = $notasSprint->count();

            // Calcular la nota total del sprint
            $notaTotalSprint = $notasSprint->sum('nota_total');

            // Calcular la nota valor sprint final aplicando el porcentaje
            $notaValorSprintFinal = ($notaTotalSprint * $notaValorSprint) / 100;

            // Obtener la cruzada correspondiente al equipo de la empresa seleccionada
            $cruzada = Cruzada::where('equipo_evaluado_id', $empresaId)->first();
            $notaCruzada = $cruzada ? $cruzada->nota_cruzada : 0;

            // Calcular la nota valor cruzada final aplicando el porcentaje
            $notaValorCruzadaFinal = ($notaCruzada * $notaValorCruzada) / 100;

            // Calcular la nota final
            $notaFinal = $notaValorSprintFinal + $notaValorCruzadaFinal;

            // Actualizar la nota final en la base de datos
            NotaFinal::updateOrCreate(
                [
                    'id_estudiante' => $estudiante->id_estudiante,
                ],
                [
                    'nota_total_sprint' => $notaTotalSprint,
                    'nota_total_sprint_ajustada' => $notaValorSprintFinal,
                    'notas_cruzada' => $notaCruzada,
                    'notas_cruzada_ajustada' => $notaValorCruzadaFinal,
                    'nota_fin' => $notaFinal,
                    'nota_valor_sprint' => $notaValorSprint,
                    'nota_valor_cruzada' => $notaValorCruzada,
                ]
            );
        }

        return response()->json(['message' => 'Notas finales actualizadas correctamente.'], 200);
    }
}
