<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Alcance;
use App\Models\Empresa;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanillaNotasController extends Controller
{
    public function getEquipos()
    {
        $docente = Auth::user();

        $empresas = Empresa::whereHas('grupos', function ($query) use ($docente) {
            $query->where('id_docente', $docente->id_docente);
        })->get();
        return response()->json($empresas);
    }
    
}
