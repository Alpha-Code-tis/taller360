<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificacionGrupoMail;
use App\Models\Ajuste;
use Illuminate\Http\Response;

class NotificacionEstudiantesController extends Controller
{
    public function notificarEstudiantesPorGrupo(Request $request)
    {
        $request->validate([
            'titulo' => 'string|max:255',
            'mensaje' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
            'tipos' => 'required|array',
        ]);

        $docente = auth()->guard('sanctum')->user();

        $grupoId = $docente->id_grupo;

        $notificacion = $request->only('titulo', 'mensaje', 'tipos');

        $grupo = Grupo::with('estudiantes')->findOrFail($grupoId);

        $ajuste = Ajuste::first();

        if (!$ajuste) {
            return response()->json(['message' => 'No hay ajustes configurados'], Response::HTTP_NOT_FOUND);
        }

        $tipos = $request->input('tipos', []);
        $tipos = empty($tipos) ? ['autoevaluacion', 'pares', 'cruzada'] : $tipos;

        $fechas = [];

        if (in_array('autoevaluacion', $tipos)) {
            if (!$ajuste->fecha_inicio_autoevaluacion || !$ajuste->fecha_fin_autoevaluacion) {
                return response()->json(['message' => 'Las fechas para autoevaluación no están configuradas.'], Response::HTTP_BAD_REQUEST);
            }
            $fechas['autoevaluacion'] = [
                'fecha_inicio' => $ajuste->fecha_inicio_autoevaluacion,
                'fecha_fin' => $ajuste->fecha_fin_autoevaluacion,
            ];
        }

        if (in_array('pares', $tipos)) {
            if (!$ajuste->fecha_inicio_eva_final || !$ajuste->fecha_fin_eva_final) {
                return response()->json(['message' => 'Las fechas para evaluación de pares no están configuradas.'], Response::HTTP_BAD_REQUEST);
            }
            $fechas['pares'] = [
                'fecha_inicio' => $ajuste->fecha_inicio_eva_final,
                'fecha_fin' => $ajuste->fecha_fin_eva_final,
            ];
        }

        if (in_array('cruzada', $tipos)) {
            if (!$ajuste->fecha_inicio_eva_cruzada || !$ajuste->fecha_fin_eva_cruzada) {
                return response()->json(['message' => 'Las fechas para evaluación cruzada no están configuradas.'], Response::HTTP_BAD_REQUEST);
            }
            $fechas['cruzada'] = [
                'fecha_inicio' => $ajuste->fecha_inicio_eva_cruzada,
                'fecha_fin' => $ajuste->fecha_fin_eva_cruzada,
            ];
        }

        $notificacion['fechas'] = $fechas;

        foreach ($grupo->estudiantes as $estudiante) {
            Mail::to($estudiante->correo)->send(new NotificacionGrupoMail($notificacion, $estudiante, $docente->nombre_docente));
        }

        return response()->json(['message' => 'Notificaciones enviadas con éxito'], Response::HTTP_OK);
    }
    public function listaFechasEval(Request $request)
    {
        $ajuste = Ajuste::first();

        if (!$ajuste) {
            return response()->json(['error' => 'No hay ajustes configurados'], Response::HTTP_NOT_FOUND);
        }

        $tipos = $request->input('tipos', []);
        $tipos = empty($tipos) ? ['autoevaluacion', 'pares', 'cruzada'] : $tipos;

        $fechas = [];

        if (in_array('autoevaluacion', $tipos)) {
            $fechas['autoevaluacion'] = [
                'fecha_inicio' => $ajuste->fecha_inicio_autoevaluacion,
                'fecha_fin' => $ajuste->fecha_fin_autoevaluacion,
            ];
        }

        if (in_array('pares', $tipos)) {
            $fechas['pares'] = [
                'fecha_inicio' => $ajuste->fecha_inicio_eva_final,
                'fecha_fin' => $ajuste->fecha_fin_eva_final,
            ];
        }

        if (in_array('cruzada', $tipos)) {
            $fechas['cruzada'] = [
                'fecha_inicio' => $ajuste->fecha_inicio_eva_cruzada,
                'fecha_fin' => $ajuste->fecha_fin_eva_cruzada,
            ];
        }

        return response()->json($fechas, Response::HTTP_OK);
    }
}
