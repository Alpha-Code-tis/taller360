<?php
namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Sprint;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function generarReporte(Request $request)
    {
        // Validar los filtros proporcionados
        $request->validate([
            'equipo_id' => 'required|exists:equipos,id_equipo',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'sprint_id' => 'nullable|exists:sprints,id_sprint',
        ]);

        // Filtrar por equipo
        $query = Empresa::where('id_equipo', $request->equipo_id);

        // Aplicar filtros opcionales
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $query->whereHas('tareas', function ($q) use ($request) {
                $q->whereBetween('fecha_creacion', [$request->fecha_inicio, $request->fecha_fin]);
            });
        }

        if ($request->filled('sprint_id')) {
            $query->whereHas('sprints', function ($q) use ($request) {
                $q->where('id_sprint', $request->sprint_id);
            });
        }

        // Obtener los datos
        $equipo = $query->with(['tareas', 'sprints'])->first();

        if (!$equipo) {
            return response()->json(['message' => 'No se encontraron datos para los filtros proporcionados.'], 404);
        }

        // Devolver el reporte
        return response()->json([
            'equipo' => $equipo->nombre,
            'tareas' => $equipo->tareas,
            'sprints' => $equipo->sprints,
        ]);
    }
}
