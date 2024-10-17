<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Planificacion;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class PlanificacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->guard('sanctum')->user();
        $id_empresa = $user->id_empresa;
        $planificacion = Planificacion::with(['sprints.alcances.tareas']) // Cargar relaciones anidadas
            ->where('id_empresa', $id_empresa) // Filtrar por id_empresa
            ->first(); // Obtener una sola planificación

        return response()->json($planificacion, Response::HTTP_OK);
    }

    public function listaEmpresasGestion($gestion)
    {
        $empresas = Empresa::where('gestion', $gestion)->get();
        return response()->json($empresas, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showSprint($id, $n_sprint)
    {
        $data = Planificacion::with(['sprints' => function ($query) use ($n_sprint) {
            $query->where('nro_sprint', $n_sprint)
                ->with('alcances.tareas');
        }])
            ->where('id_planificacion', $id)
            ->get();

        return response()->json($data, Response::HTTP_OK);
    }

    public function showSprintUser($n_sprint)
    {
        $user = auth()->guard('sanctum')->user();
        $id_empresa = $user->id_empresa;
        $planificacion = Planificacion::with(['sprints.alcances.tareas']) // Cargar relaciones anidadas
            ->where('id_empresa', $id_empresa) // Filtrar por id_empresa
            ->first();
        dd($planificacion);
        $data = Planificacion::with(['sprints' => function ($query) use ($n_sprint) {
            $query->where('nro_sprint', $n_sprint)
                ->with('alcances.tareas');
        }])
            ->where('id_planificacion', $planificacion->id_planificacion)
            ->get();

        return response()->json($data, Response::HTTP_OK);
    }

    public function show($id)
    {
        $data = Planificacion::find($id);
        return response()->json($data, Response::HTTP_OK);
    }

    public function listaSprintsUnicos()
    {
        $user = auth()->guard('sanctum')->user();
        $id_empresa = $user->id_empresa;
        $planificacion = Planificacion::with('sprints')
            ->where('id_empresa', $id_empresa)
            ->first();

        if ($planificacion) {
            $nroSprints = $planificacion->sprints->pluck('nro_sprint')->unique();
        } else {
            $nroSprints = [];
        }

        return response()->json($nroSprints);
    }

    public function listarSprints($id_empresa)
    {
        $planificacion = Planificacion::with('sprints')
            ->where('id_empresa', $id_empresa)
            ->first();

        if ($planificacion) {
            $nroSprints = $planificacion->sprints->pluck('nro_sprint')->unique();
        } else {
            $nroSprints = [];
        }

        return response()->json($nroSprints);
    }

    public function obtenerIdPlanificacion($id_empresa, $gestion)
    {
        $empresa = Empresa::where('id_empresa', $id_empresa)
            ->where('gestion', $gestion)
            ->first();
        if ($empresa) {
            $planificacion = Planificacion::where('id_empresa', $empresa->id_empresa)->first();

            if ($planificacion) {
                return response()->json(['id_planificacion' => $planificacion->id_planificacion]);
            } else {
                return response()->json(['message' => 'No se encontró la planificación para la empresa especificada.'], 404);
            }
        } else {
            return response()->json(['message' => 'No se encontró la empresa para la gestión especificada.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
