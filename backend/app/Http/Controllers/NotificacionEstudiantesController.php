<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificacionGrupoMail;

class NotificacionEstudiantesController extends Controller
{
    public function notificarEstudiantesPorGrupo(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'detalles' => 'required|array',
        ]);

        $docente = auth()->guard('sanctum')->user();

        $grupoId = $docente->id_grupo;

        $notificacion = $request->only('titulo', 'mensaje', 'detalles');

        $grupo = Grupo::with('estudiantes')->findOrFail($grupoId);
        foreach ($grupo->estudiantes as $estudiante) {
            Mail::to('201910108@est.umss.edu')->send(new NotificacionGrupoMail($notificacion, $estudiante));
        }

        return response()->json(['message' => 'Notificaciones enviadas con éxito'], 200);
    }
}
