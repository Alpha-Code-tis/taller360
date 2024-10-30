<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Empresa;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluacionSemanalController extends Controller
{
    // Obtener los equipos del docente autenticado
    public function getEquipos()
    {
        // Obtener el docente autenticado
        $docente = Auth::user();

        // Obtener las empresas asociadas a los grupos del docente
        $empresas = Empresa::whereHas('grupos', function ($query) use ($docente) {
            $query->where('id_docente', $docente->id_docente);
        })->get();
        return response()->json($empresas);
    }


    // Obtener los sprints de una empresa
    public function getSprints($empresaId)
    {
        $sprints = Sprint::where('id_empresa', $empresaId)->get();
        return response()->json($sprints);
    }

    // Obtener las tareas de un sprint
    public function getTareas($sprintId)
    {
        $tareas = Tarea::where('id_sprint', $sprintId)->get();
        return response()->json($tareas);
    }

    // Actualizar la calificacion y observaciones de una tarea
    public function updateTarea(Request $request, $tareaId)
    {
        $tarea = Tarea::findOrFail($tareaId);
        
        // Solo tareas con estado "En Progreso" o "Terminado"
        if (in_array($tarea->estado, ['En Progreso', 'Terminado'])) {
            $tarea->calificacion = $request->input('calificacion');
            $tarea->observaciones = $request->input('observaciones');
            $tarea->save();
            return response()->json(['message' => 'Tarea actualizada correctamente']);
        }

        return response()->json(['message' => 'No se puede calificar esta tarea'], 400);
    }
}
