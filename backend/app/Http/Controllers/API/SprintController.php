<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alcance;
use App\Models\Sprint;
use App\Models\Tarea;
use Carbon\Carbon;
use \Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SprintController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nro_sprint' => 'required|integer',
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'fecha_inicio' => 'required|date_format:d/m/Y',
            'fecha_fin' => 'required|date_format:d/m/Y|after_or_equal:fecha_inicio',
            'alcance' => ['required', 'string', 'regex:/^[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
            'tareas' => 'required|array',
            'tareas.*.nombre' => ['required', 'string', 'regex:/^[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();

        try {

            $validated = $validator->validated();
            $id_planificacion = 2;

            $solapamiento = Sprint::where('id_planificacion', $id_planificacion)
                ->where('nro_sprint', '!=', $validated['nro_sprint'])
                ->where(function ($query) use ($validated) {
                    $query->where(function ($q) use ($validated) {
                        $q->where('fecha_inicio', '<=', Carbon::createFromFormat('d/m/Y', $validated['fecha_fin'])->format('Y-m-d'))
                            ->where('fecha_fin', '>=', Carbon::createFromFormat('d/m/Y', $validated['fecha_inicio'])->format('Y-m-d'));
                    });
                })
                ->exists();
            if ($solapamiento) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Hay solapamientos de fechas',
                ], Response::HTTP_CONFLICT);
            }
            $colorExistente = Sprint::where('id_planificacion', $id_planificacion)
                ->where('color', $validated['color'])
                ->exists();

            if ($colorExistente) {
                DB::rollBack();
                return response()->json([
                    'message' => 'El color ya está en uso por otro sprint.',
                ], Response::HTTP_CONFLICT);
            }

            $sprint = Sprint::where('nro_sprint', $validated['nro_sprint'])
                ->where('fecha_inicio', Carbon::createFromFormat('d/m/Y', $validated['fecha_inicio'])->format('Y-m-d'))
                ->where('fecha_fin', Carbon::createFromFormat('d/m/Y', $validated['fecha_fin'])->format('Y-m-d'))
                ->where('id_planificacion', $id_planificacion)
                ->first();
            if (!$sprint) {
                $sprintsExistentes = Sprint::where('id_planificacion', $id_planificacion)
                    ->orderBy('nro_sprint')
                    ->pluck('nro_sprint')
                    ->toArray();

                $siguienteSprint = count($sprintsExistentes) + 1;

                // Verificar si el número de sprint es el siguiente
                if ($validated['nro_sprint'] !== $siguienteSprint) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'El número de sprint debe ser ' . $siguienteSprint . '.',
                    ], Response::HTTP_CONFLICT);
                }
                $sprint = new Sprint;
                $sprint->nro_sprint = $validated['nro_sprint'];
                $sprint->id_planificacion = $id_planificacion;
                $sprint->color = $validated['color'];
                $sprint->fecha_inicio = Carbon::createFromFormat('d/m/Y', $validated['fecha_inicio'])->format('Y-m-d');
                $sprint->fecha_fin = Carbon::createFromFormat('d/m/Y', $validated['fecha_fin'])->format('Y-m-d');
                $sprint->save();
            }
            $alcance = Alcance::where('descripcion', $validated['alcance'])
                ->where('id_sprint', $sprint->id_sprint)
                ->first();
            if (!$alcance) {
                $alcance = new Alcance;
                $alcance->descripcion = $validated['alcance'];
                $alcance->id_sprint = $sprint->id_sprint;
                $alcance->save();
            } else {
                DB::rollBack();
                $sprintsExistentes = Sprint::where('id_planificacion', $id_planificacion)
                    ->orderBy('nro_sprint')
                    ->pluck('nro_sprint')
                    ->toArray();

                $siguienteSprint = count($sprintsExistentes) + 1;
                return response()->json([
                    'message' => 'El alcance ya existe',
                    'alcance' => $alcance,
                    'error' => "El siguiente sprint debe ser el $siguienteSprint.",
                ], Response::HTTP_CONFLICT);
            }
            foreach ($validated['tareas'] as $tarea) {
                $tareaN = new Tarea();
                $tareaN->nombre_tarea = $tarea['nombre'];
                $tareaN->id_alcance = $alcance->id_alcance;
                $tareaN->save();
            }
            DB::commit();
            return response()->json([
                'message' => 'Registro exitoso',
                'sprint' => $sprint,
                'alcance' => $alcance,
                'tareas' => $validated['tareas'],
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al registrar',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
