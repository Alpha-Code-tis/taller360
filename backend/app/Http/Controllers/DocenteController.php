<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Models\Grupo;
use App\Models\Notificacion_doc;
use App\Models\Administrador;
use App\Models\Docente;
use \Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocenteController extends Controller
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
        $validator = validator::make($request->all(), [
            'nombre_docente'=> 'required|String',   
            'ap_pat'=> 'required|String', 
            'ap_mat'=> 'required|String',  
            'correo'=> 'required|String', 
            'nro_grupo'=> 'required|int', 
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no validos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();

        try{
            $validated = $validator->validated();

            $Docente = new Docente;
            $Docente->nombre_docente = $validated['nombre_docente'];
            $Docente->ap_pat = $validated['ap_pat'];
            $Docente->ap_mat = $validated['ap_mat'];
            $Docente->correo = $validated['correo'];
            $Docente->save();
            $Grupo = new Grupo;
            $Grupo->nro_grupo = $validated['nro_grupo'];
            $Grupo->id_docente = $Docente->id_docente;
            $Grupo->save();
            $Docente->id_grupo = $Grupo->id_grupo;
            $Docente->save();

            $id_docente = 1;
            $Docente = Docente::where('correo', $validated['correo'])
           

            ->first();

        }catch (\Exception $e) {
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
