<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;


class GenerarPlanillaPDFController extends Controller
{
    public function generarPDFPlanilla()
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener las empresas asociadas a los grupos del docente
        $empresas = Empresa::whereHas('grupos', function ($query) use ($docente) {
            $query->where('id_docente', $docente->id_docente);
        })->get();

        // Obtener la fecha del primer sprint
        $primerSprint = Sprint::orderBy('fecha_inicio', 'asc')->first();

        if (!$primerSprint) {
            return response()->json(['error' => 'No se ha encontrado ningún sprint.'], 404);
        }

        // Verificar si han pasado al menos 7 días desde el primer día del primer sprint
        $fechaPrimerSprint = Carbon::parse($primerSprint->fecha_inicio);
        $diasDesdePrimerSprint = Carbon::now()->diffInDays($fechaPrimerSprint);

        // Permitir generar el PDF solo si han pasado al menos 7 días
        if ($diasDesdePrimerSprint < 7) {
            return response()->json(['error' => 'La generación del PDF solo está permitida cada 7 días desde el inicio del primer sprint.'], 403);
        }

        // Obtener la última fecha de generación del PDF
        $ultimaGeneracion = Cache::get('ultima_generacion_pdf_' . $docente->id_docente);
        if ($ultimaGeneracion) {
            $diasDesdeUltimaGeneracion = Carbon::now()->diffInDays($ultimaGeneracion);

            // Si no han pasado 7 días desde la última generación, impedir la creación
            if ($diasDesdeUltimaGeneracion < 7) {
                return response()->json(['error' => 'Ya se ha generado un PDF en los últimos 7 días. Intente nuevamente más adelante.'], 403);
            }
        }

        // Definir el rango de fechas para el PDF (últimos 7 días)
        $fechaInicio = Carbon::now()->subDays(6)->startOfDay(); 
        $fechaFin = Carbon::now()->endOfDay(); 

        // Generar el PDF para cada empresa
        foreach ($empresas as $empresa) {
            // Obtener los sprints de la empresa
            $sprints = Sprint::where('id_planificacion', $empresa->planificacion->id_planificacion)->get();

            foreach ($sprints as $sprint) {
                // Obtener las tareas del sprint
                $tareas = Tarea::whereIn('id_alcance', $sprint->alcances->pluck('id_alcance'))->with('estudiantes')->get();

                // Preparar los datos para el PDF
                $data = [
                    'empresa' => $empresa,
                    'sprint' => $sprint,
                    'fecha_inicio' => $fechaInicio->format('d/m/Y'),
                    'fecha_fin' => $fechaFin->format('d/m/Y'),
                    'tareas' => $tareas
                ];

                // Generar el PDF utilizando la vista correspondiente
                $pdf = Pdf::loadView('pdf.planilla_docente', $data);
                $pdfPath = 'planillas/' . $empresa->nombre_empresa . '_sprint_' . $sprint->id_sprint . '_planilla_' . $fechaInicio->format('Ymd') . '.pdf';
                Storage::put($pdfPath, $pdf->output());
            }
        }

        // Actualizar la fecha de la última generación del PDF
        Cache::put('ultima_generacion_pdf_' . $docente->id_docente, Carbon::now(), Carbon::now()->addDays(7));

        return response()->json(['message' => 'Planillas generadas correctamente']);
    }
}
