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
            'sprint_id' => 'nullable|exists:sprints,id_sprint',
        ]);

        // Filtrar por equipo
        $query = Empresa::where('id_equipo', $request->equipo_id);

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
