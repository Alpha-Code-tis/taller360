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
        try {
            // Obtener todos los docentes con sus grupos asociados
            $docentes = Docente::with('grupo')->get();

            // Obtener la lista de grupos disponibles para el desplegable
            $grupos = Grupo::all();

            return response()->json([
                'docentes' => $docentes,
                'grupos' => $grupos,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la lista de docentes o grupos',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
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
            'nro_grupo'=> 'required|exists:grupo,nro_grupo', 
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
            $Docente->nro_grupo = $validated['nro_grupo']; 
            $Docente->save();

            DB::commit();
            
            return response()->json([
                'message' => 'Docente registrado exitosamente',
                'docente' => $Docente,
            ], Response::HTTP_CREATED);

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
        try {
            // Buscar el docente por su ID
            $Docente = Docente::with('grupo')->findOrFail($id);

            return response()->json([
                'docente' => $Docente,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Docente no encontrado',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
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
        $validator = Validator::make($request->all(), [
            'nombre_docente' => 'sometimes|required|string',
            'ap_pat' => 'sometimes|required|string',
            'ap_mat' => 'sometimes|required|string',
            'correo' => 'sometimes|required|email|unique:docente,correo,' . $id,
            'id_grupo' => 'sometimes|required|exists:grupo,id_grupo',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $docente = Docente::findOrFail($id);

            // Actualizar los datos del docente si están presentes en la solicitud
            $docente->update($validator->validated());

            return response()->json([
                'message' => 'Docente actualizado exitosamente',
                'docente' => $docente,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el docente',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $docente = Docente::findOrFail($id);
            $docente->delete();

            return response()->json([
                'message' => 'Docente eliminado exitosamente',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el docente',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
    }
}
