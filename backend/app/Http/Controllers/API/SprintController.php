<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alcance;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Tarea;
use Carbon\Carbon;
use \Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SprintController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    private function validarCampoNumerico($valor, $nombreCampo) {
        if (!trim($valor)) {
            return "El campo \"$nombreCampo\" no puede estar vacío.";
        }
        if (!preg_match('/^\d+$/', $valor)) {
            return "El campo \"$nombreCampo\" debe contener solo números.";
        }
        return null;
    }

    private function validarCampoTexto($valor, $nombreCampo) {
        if (!trim($valor)) {
            return "El campo \"$nombreCampo\" no puede estar vacío.";
        }

        if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/u', $valor)) {
            return "El campo \"$nombreCampo\" debe contener solo letras, sin números ni caracteres especiales.";
        }

        $vocales = 'aeiouáéíóúAEIOUÁÉÍÓÚ';
        $contadorVocales = 0;
        $contadorConsonantes = 0;
        $ultimaLetra = '';
        $repetidas = 1;

        for ($i = 0; $i < mb_strlen($valor); $i++) {
            $char = mb_substr($valor, $i, 1);

            // Letras idénticas consecutivas
            if ($char === $ultimaLetra) {
                $repetidas++;
                if ($repetidas >= 3) {
                    return "El campo \"$nombreCampo\" no puede tener 3 letras idénticas consecutivas.";
                }
            } else {
                $repetidas = 1;
            }

            if (mb_strpos($vocales, $char) !== false) {
                // Es vocal
                $contadorVocales++;
                $contadorConsonantes = 0;
                if ($contadorVocales >= 3) {
                    return "El campo \"$nombreCampo\" no puede tener 3 vocales consecutivas.";
                }
            } else {
                // Es consonante
                $contadorConsonantes++;
                $contadorVocales = 0;
                if ($contadorConsonantes >= 3) {
                    return "El campo \"$nombreCampo\" no puede tener 3 consonantes consecutivas.";
                }
            }

            $ultimaLetra = $char;
        }

        return null;
    }


    public function index()
    {
        $empresaId = request('empresaId');
        $sprints = Sprint::query()
            ->when(
                isset($empresaId),
                fn ($q) => $q->whereHas(
                    'planificacion',
                    fn ($q) => $q->where('id_empresa', $empresaId)
                )
            )
            ->get();
        return $sprints;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $messages = [
            'requerimiento.regex' => 'El campo requerimiento no debe contener tres caracteres consecutivos idénticos.',
            'tareas.*.nombre.regex' => 'El nombre de una tarea no debe contener tres caracteres consecutivos idénticos.',
        ];        
        $validator = Validator::make($request->all(), [
            'nro_sprint' => 'required|integer|min:1',
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'fecha_inicio' => 'required|date_format:d/m/Y',
            'fecha_fin' => 'required|date_format:d/m/Y|after_or_equal:fecha_inicio',
            'requerimiento' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
            'porcentaje' => 'required|integer',
            'tareas' => 'required|array',
            'tareas.*.nombre' => ['required','string','regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ]+$/u'],
            'tareas.*.estimacion' => 'required|integer|min:1',
        ], $messages);

        $validator->after(function ($validator) use ($request) {
            
            // Validar porcentaje (si se le quiere aplicar las mismas reglas que a cobro)
            $error = $this->validarCampoNumerico($request->porcentaje, 'Porcentaje');
            if ($error) {
                $validator->errors()->add('porcentaje', $error);
            }

            // Validar requerimiento
            $error = $this->validarCampoTexto($request->requerimiento, 'Requerimiento');
            if ($error) {
                $validator->errors()->add('requerimiento', $error);
            }

            // Validar tareas (nombre)
            if (is_array($request->tareas)) {
                foreach ($request->tareas as $index => $tarea) {
                    if (isset($tarea['nombre'])) {
                        $error = $this->validarCampoTexto($tarea['nombre'], "Nombre de la tarea");
                        if ($error) {
                            $validator->errors()->add("tareas.$index.nombre", $error);
                        }
                    }
                    if (isset($tarea['estimacion'])) {
                        $error = $this->validarCampoNumerico($tarea['estimacion'], "Estimación de la tarea");
                        if ($error) {
                            $validator->errors()->add("tareas.$index.estimacion", $error);
                        }
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();

        try {

            $validated = $validator->validated();
            $user = auth()->guard('sanctum')->user(); // Asegurarse de usar el guard correcto
            $empresa = Empresa::where('id_empresa', $user->id_empresa)
                ->first();
            if (!$empresa) {
                return response()->json([
                    'message' => 'El estudiante no pertenece a la empresa especificada',
                ], Response::HTTP_FORBIDDEN);
            }

            $id_planificacion = Planificacion::where('id_empresa', $empresa->id_empresa)->value('id_planificacion');
            if (!$id_planificacion) {
                return response()->json([
                    'message' => 'El estudiante no tiene planificación asignada',
                ], Response::HTTP_NOT_FOUND);
            }

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
                $totalPorcentaje = Sprint::where('id_planificacion', $id_planificacion)->sum('porcentaje');

                if ($totalPorcentaje + $validated['porcentaje'] > 100) {
                    DB::rollBack();
                    return response()->json(['message' => 'El total de los porcentajes no debe exceder el 100% - tu total es: ' .$totalPorcentaje . '.'], Response::HTTP_CONFLICT);
                }
                $sprint = new Sprint;
                $sprint->nro_sprint = $validated['nro_sprint'];
                $sprint->id_planificacion = $id_planificacion;
                $sprint->color = $validated['color'];
                $sprint->fecha_inicio = Carbon::createFromFormat('d/m/Y', $validated['fecha_inicio'])->format('Y-m-d');
                $sprint->fecha_fin = Carbon::createFromFormat('d/m/Y', $validated['fecha_fin'])->format('Y-m-d');
                $sprint->porcentaje = $validated['porcentaje'];
                $sprint->save();
            }
            $alcance = Alcance::where('descripcion', $validated['requerimiento'])
                ->where('id_sprint', $sprint->id_sprint)
                ->first();
            if (!$alcance) {
                $alcance = new Alcance;
                $alcance->descripcion = $validated['requerimiento'];
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
                $tareaN->estimacion = $tarea['estimacion'];
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
