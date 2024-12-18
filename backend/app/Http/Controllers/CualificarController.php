<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use App\Models\Estudiante;
use App\Models\NotaFinal;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class CualificarController extends Controller
{

    public function index()
    {
        $docente = auth()->guard('sanctum')->user();
        $estudiantes = Estudiante::where('id_grupo', $docente->id_grupo)->get();
        $resultado = $estudiantes->map(function ($estudiante) {
            $notaFinal = NotaFinal::where('id_estudiante', $estudiante->id_estudiante)->value('nota_fin');
            $notaFinal = $notaFinal ?? 0;
            return [
                'nombre' => $estudiante->nombre_estudiante . ' ' . $estudiante->ap_pat . ' ' . $estudiante->ap_mat,
                'nota' => $notaFinal,
                'clasificacion' => $notaFinal > 50 ? 'fuerte' : 'débil',
            ];
        });

        return response()->json($resultado, Response::HTTP_OK);
    }
}
