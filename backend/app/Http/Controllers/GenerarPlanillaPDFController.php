<?php

// app/Http/Controllers/GenerarPlanillaPDFController.php
namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf as PDF; // Importar la clase correcta
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;

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

        // Definir el rango de fechas
        $fechaInicio = Carbon::now()->startOfWeek(); // Día siguiente al final del último ciclo de 7 días
        $fechaFin = $fechaInicio->copy()->addDays(6); // El día 7 después del inicio

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
                $pdf = PDF::loadView('pdf.planilla_docente', $data);
                $pdfPath = 'planillas/' . $empresa->nombre_empresa . '_sprint_' . $sprint->id_sprint . '_planilla_' . $fechaInicio->format('Ymd') . '.pdf';
                Storage::put($pdfPath, $pdf->output());
            }
        }

        return response()->json(['message' => 'Planillas generadas correctamente']);
    }
}
