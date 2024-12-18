<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\EstudianteTarea;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanillaDocenteController extends Controller
{
    public function mostrarEmpresas()
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

    public function mostrarSprints($empresaId)
    {
        $sprints = Sprint::whereIn('id_planificacion', function ($query) use ($empresaId) {
            $query->select('id_planificacion')
                ->from('planificacion')
                ->where('id_empresa', $empresaId);
        })->get();

        return response()->json($sprints);
    }

    // Obtener los sprints de una empresa seleccionada
    public function getSprintsByEmpresa($empresaId)
    {
        $sprints = Sprint::whereIn('id_planificacion', function ($query) use ($empresaId) {
            $query->select('id_planificacion')
                ->from('planificacion')
                ->where('id_empresa', $empresaId);
        })->get();

        return response()->json($sprints);
    }


    public function mostrarTareas($empresaId, $sprintId)
    {
        // Filtrar las tareas de la empresa seleccionada y sprint seleccionado
        $tareas = Tarea::whereHas('alcance', function ($query) use ($empresaId, $sprintId) {
            $query->whereHas('sprint', function ($query) use ($empresaId, $sprintId) {
                $query->where('id_sprint', $sprintId) // Filtrar por el sprint seleccionado
                    ->whereHas('planificacion', function ($query) use ($empresaId) {
                        $query->where('id_empresa', $empresaId); // Filtrar por la empresa seleccionada
                    });
            });
        })->where(function ($query) {
            $query->whereIn('estado', ['Pendiente', 'En Progreso'])
                ->orWhere(function ($query) {
                    $query->where('estado', 'Terminado')->where('revisado', false);
                });
        })->get();

        // Agregar los nombres de los responsables (estudiantes) para cada tarea
        $tareasConResponsables = $tareas->map(function ($tarea) {
            $responsables = EstudianteTarea::where('id_tarea', $tarea->id_tarea)
                ->with('estudiante')
                ->get()
                ->pluck('estudiante.nombre_estudiante')
                ->implode(', ');
            $tarea->responsables = $responsables;
            return $tarea;
        });

        return response()->json($tareasConResponsables);
    }

    public function actualizarProgreso(Request $request, $tareaId)
    {
        // Validar la solicitud
        $request->validate([
            'progreso' => 'required|in:0,20,40,60,80,100'
        ]);

        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener la tarea y verificar que pertenece al grupo del docente,
        // filtrando también por empresa y sprint
        $tarea = Tarea::where('id_tarea', $tareaId)
            ->firstOrFail();

        // Actualizar el progreso de la tarea
        $tarea->progreso = $request->input('progreso');

        // Actualizar el estado de la tarea en base al progreso
        if ($tarea->progreso == 0) {
            $tarea->estado = 'Pendiente';
        } elseif ($tarea->progreso > 0 && $tarea->progreso < 100) {
            $tarea->estado = 'En progreso';
        } elseif ($tarea->progreso == 100) {
            $tarea->estado = 'Terminado';
        }

        $tarea->save();

        return response()->json(['message' => 'Progreso de la tarea actualizado correctamente']);
    }


    public function verAvances($tareaId)
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener la tarea y verificar que pertenece al grupo del docente
        $tarea = Tarea::where('id_tarea', $tareaId)
            ->firstOrFail();

        // Obtener la lista de avances
        $avances = $tarea->avances ? explode(",", $tarea->avances) : [];

        return response()->json($avances);
    }
}
