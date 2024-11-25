<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SprintController;
use App\Http\Controllers\API\PlanificacionController;
use App\Http\Controllers\CriterioController;
use App\Http\Controllers\AutoevaluacionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PlanillaDocenteController;
use App\Http\Controllers\PlanillaController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\EvaluacionFinalController;
use App\Http\Controllers\AjustesController;
use App\Http\Controllers\EvaluacionController;
use App\Http\Controllers\CantidadGestionController;
use App\Http\Controllers\EvaluacionParesController;
use App\Http\Controllers\CruzadaController;
use App\Http\Controllers\ReporteController;
use App\Models\Planificacion;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Storage;
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
    //Autoevaluación estudiante_tarea
    Route::get('/autoevaluacion/estudiantes-tareas', [AutoevaluacionController::class, 'mostrarEstudiantesTareas']);
    Route::patch('/autoevaluacion/{id_tarea}', [AutoevaluacionController::class, 'update']);
    //eva_final
    Route::get('/grupo/integrantes', [EmpresaController::class, 'getIntegrantesGrupo'])->middleware('auth:api');
    Route::post('/evaluacion_final', [EvaluacionFinalController::class, 'store']);
    Route::get('/evaluacion_final/{id_est_evaluado}', [EvaluacionFinalController::class, 'showEvaluaciones']);
    //fechas
    Route::get('/ajustes', [AjustesController::class, 'show']);
    Route::patch('/ajustes', [AjustesController::class, 'update']);
    Route::put('/ajustes/update', [AjustesController::class, 'update']);



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
    Route::post('/api/save-team-config', [CantidadGestionController::class, 'store']);


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
    Route::get('/tareas/sprints', [TareaController::class, 'mostrarSprints']);
    Route::get('/tareas/tareasEmpresa/{empresaId}', [TareaController::class, 'mostrarTodasLasTareas']);
    Route::get('/tareas/{sprintId}', [TareaController::class, 'mostrarTareas']);
    Route::get('/tareas', [TareaController::class, 'mostrarTarea']);
    Route::post('/tareas/{tareaId}/subir-avance', [TareaController::class, 'subirAvance']);
    Route::get('/tareas/{tareaId}/avances', [TareaController::class, 'verAvances']);
    Route::delete('/tareas/{tareaId}/avances/{avanceIndex}', [TareaController::class, 'eliminarAvance']);

    //Criterios
    Route::get('/criterios', [CriterioController::class, 'index']);
    Route::get('/criterios/{id_criterio}', [CriterioController::class, 'show']);
    Route::post('/criterios', [CriterioController::class, 'store']);
    Route::put('/criterios/{id_criterio}', [CriterioController::class, 'update']);
    Route::delete('/criterios/{id_criterio}', [CriterioController::class, 'destroy']);
    Route::get('/criterios/tarea/{tareaId}', [CriterioController::class, 'criteriosPorTarea']);

    //Gestion-Cantidad
    Route::post('/gestion', [CantidadGestionController::class, 'store']);


    //Evaluacion
    Route::get('/evaluation/form', [EvaluacionController::class, 'showEvaluationForm']);
    Route::get('/evaluation/sprints/{empresaId}', [EvaluacionController::class, 'getSprintsByEmpresa'])->name('evaluation.sprints');
    Route::get('/evaluation/weeks/{sprintId}', [EvaluacionController::class, 'getWeeksBySprint'])->name('evaluation.weeks');
    Route::get('/evaluation/tareas/{empresaId}/sprint/{sprintId}', [EvaluacionController::class, 'getTareasByEmpresa'])->name('evaluation.tareas');
    Route::post('/evaluation/save', [EvaluacionController::class, 'saveEvaluation'])->name('evaluation.save');
    Route::get('/evaluation/reviewed/{sprintId}/{week}', [EvaluacionController::class, 'getReviewedWeek'])->name('evaluation.reviewed');
    Route::get('/evaluation/sprint/{sprintId}', [EvaluacionController::class, 'getSprintPercentage']);
    Route::post('autoevaluacion/evaluaciones/', [EvaluacionController::class, 'guardarEvaluacion']);


    //Evaluación pares
    Route::post('/evaluacionPares', [EvaluacionParesController::class, 'store']);
    Route::get('/evaluacionPares/{id_estudiante_evaluado}', [EvaluacionParesController::class, 'getEvaluacionPares']);

    // Rutas de Evaluación Cruzada
        Route::get('/cruzada/planillas', [PlanillaController::class, 'obtenerPlanillasCruzada']);
        Route::get('/cruzada/empresas', [CruzadaController::class, 'getEmpresas']);
        Route::get('/cruzada/empresas/{id}/estudiantes', [CruzadaController::class, 'getEstudiantesByEmpresa']);
    
    // Reportes por Equipo
    Route::post('/reporte', [ReporteController::class, 'generarReporte']);
});
