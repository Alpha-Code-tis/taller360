<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
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

    public function show($id)
    {
        $data = Planificacion::find($id);
        return response()->json($data, Response::HTTP_OK);
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
