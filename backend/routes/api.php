<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SprintController;
use App\Http\Controllers\API\PlanificacionController;
use App\Http\Controllers\CriterioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PlanillaDocenteController;
use App\Http\Controllers\PlanillaController;
use App\Http\Controllers\TareaController;

use App\Models\Planificacion;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login'])->name("login");
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/usuario', function (Request $request) {
        $user = null;

        // Verifica qué tipo de usuario está autenticado
        if (Auth::guard('docente')->check()) {
            $user = Auth::guard('docente')->user();
            $user_role = "docente";
        } elseif (Auth::guard('admin')->check()) {
            $user = Auth::guard('admin')->user();
            $user_role = "admin";
        } elseif (Auth::guard('estudiante')->check()) {
            $user = Auth::guard('estudiante')->user();
            $user_role = "estudiante";
        }

        return response()->json([
            'message' => 'Bienvenido al dashboard',
            'role' => $user_role,
            'user' => $user,
        ]);
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/planificacion', [SprintController::class, 'store']);
    Route::get('/planificacion', [PlanificacionController::class, 'index']);
    Route::get('/planificacion/{id}', [PlanificacionController::class, 'show']);
    Route::get('/planificacion/{id}/sprint={n_sprint}', [PlanificacionController::class, 'showSprint']);
    Route::get('/planificacion/sprint={n_sprint}', [PlanificacionController::class, 'showSprintUser']);
    Route::get('/estudiantes', [EstudianteController::class, 'index']);
    Route::get('/estudiantes/{id}', [EstudianteController::class, 'show']);
    Route::post('/estudiantes', [EstudianteController::class, 'store']);
    Route::get('/listaEstudiantes', [EstudianteController::class, 'listaEstudiantes']);
    Route::put('/estudiantes/{id}', [EstudianteController::class, 'update']);
    Route::delete('/estudiantes/{id}', [EstudianteController::class, 'destroy']);
    Route::post('/estudiantes/import', [EstudianteController::class, 'import']);
    Route::get('/listarSprints', [PlanificacionController::class, 'listaSprintsUnicos']);
    Route::get('/listarSprintsEmpresa/{id_empresa}', [PlanificacionController::class, 'listarSprints']);
    Route::get('/planificacion/{id_empresa}/{gestion}/{sprint}', [PlanificacionController::class, 'obtenerIdPlanificacion']);

Route::get('/login-with-token', [DocenteController::class, 'loginWithToken']);

//grupo
Route::get('/grupos', [GrupoController::class, 'index']);
Route::get('/grupos/{id}', [GrupoController::class, 'show']);
Route::post('/grupos', [GrupoController::class, 'store']);
Route::put('/grupos/{id}', [GrupoController::class, 'update']);
Route::delete('/grupos/{id}', [GrupoController::class, 'destroy']);

//docente
Route::get('/docentes', [DocenteController::class, 'index']);
Route::get('/docentes/{id}', [DocenteController::class, 'show']);
Route::post('/docentes', [DocenteController::class, 'store']);
Route::put('/docentes/{id}', [DocenteController::class, 'update']);
Route::delete('/docentes/{id}', [DocenteController::class, 'destroy']);

//Empresa-equipo
Route::get('/equipos', [EmpresaController::class, 'index']);
Route::post('/equipos', [EmpresaController::class, 'store']);
Route::get('/equipos/{id_empresa}', [EmpresaController::class, 'show']);
Route::put('/equipos/{id_empresa}', [EmpresaController::class, 'update']);
Route::delete('/equipos/{id_empresa}', [EmpresaController::class, 'destroy']);
Route::get('/sin-empresa', [EmpresaController::class, 'getEstudiantesSinEmpresa']);
Route::get('/empresa/{id_empresa}/estudiantes', [EmpresaController::class, 'getEstudiantesPorEmpresa']);
Route::get('/gestiones', [EmpresaController::class, 'gestiones']);
Route::get('/listarEmpresas/{gestion}', [PlanificacionController::class, 'listaEmpresasGestion']);

//Planilla-Docente
Route::get('/planilla/empresas', [PlanillaDocenteController::class, 'mostrarEmpresas']);
Route::get('/planilla/empresas/{empresaId}/sprints', [PlanillaDocenteController::class, 'mostrarSprints']); 
Route::get('/planilla/sprints/{sprintId}/tareas', [PlanillaDocenteController::class, 'mostrarTareas']); 
Route::put('/planilla/tareas/{tareaId}/actualizar-progreso', [PlanillaDocenteController::class, 'actualizarProgreso']); 
Route::get('/planilla/tareas/{tareaId}/ver-avances', [PlanillaDocenteController::class, 'verAvances']); 

//Planilla-Representante
Route::get('/sprints', [PlanillaController::class, 'mostrarSprints']); 
Route::get('/sprints/{sprintId}/tareas', [PlanillaController::class, 'mostrarTareas']); 
Route::post('/tareas/{tareaId}/asignar-estudiantes', [PlanillaController::class, 'asignarEstudiantes']); 
Route::delete('/tareas/{tareaId}/estudiantes/{estudianteId}', [PlanillaController::class, 'eliminarEstudianteDeTarea']); 

//Tarea
 
Route::get('/tareas/{sprintId}', [TareaController::class, 'mostrarTareas']);
Route::post('/tareas/{tareaId}/subir-avance', [TareaController::class, 'subirAvance']);
Route::get('/tareas/{tareaId}/avances', [TareaController::class, 'verAvances']);
Route::delete('/tareas/{tareaId}/avances/{avanceIndex}', [TareaController::class, 'eliminarAvance']);

//Criterios
Route::get('/criterios', [CriterioController::class, 'index']);
Route::get('/criterios/{id_criterio}', [CriterioController::class,'show']);
Route::post('/criterios', [CriterioController::class,'store']);
Route::put('/criterios/{id_criterio}', [CriterioController::class,'update']);
Route::delete('/criterios/{id_criterio}', [CriterioController::class,'destroy']);
});