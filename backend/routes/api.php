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
use App\Http\Controllers\Cualificar;
use App\Http\Controllers\StudentReportController;
use App\Http\Controllers\CualificarController;
use App\Http\Controllers\EvaluacionParesController;
use App\Http\Controllers\CruzadaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\NotificacionEstudiantesController;
use App\Http\Controllers\PlanillaNotasController;
use App\Http\Controllers\PlanillaNotasFinalesController;
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
    Route::get('/equiposEstudiantes', [EmpresaController::class, 'indexEstudiante']);

    //Planilla-Docente
    Route::get('/planilla/empresas', [PlanillaDocenteController::class, 'mostrarEmpresas']);
    Route::get('/planilla/empresas/{empresaId}/sprints', [PlanillaDocenteController::class, 'mostrarSprints']);
    Route::get('/planilla/empresas/{empresaId}/sprints/{sprintId}/tareas', [PlanillaDocenteController::class, 'mostrarTareas']);
    Route::put('/planilla/tareas/{tareaId}/actualizar-progreso', [PlanillaDocenteController::class, 'actualizarProgreso']);
    Route::get('/planilla/tareas/{tareaId}/ver-avances', [PlanillaDocenteController::class, 'verAvances']);
    Route::get('/evaluation/reviewed-week/{sprintId}/{week}', [EvaluacionController::class, 'getReviewedWeek']);

    //Planilla-Representante
    Route::get('/sprints', [PlanillaController::class, 'mostrarSprints']);
    Route::get('/sprints/{sprintId}/tareas', [PlanillaController::class, 'mostrarTareas']);
    Route::post('/tareas/{tareaId}/asignar-estudiantes', [PlanillaController::class, 'asignarEstudiantes']);
    Route::delete('/tareas/{tareaId}/estudiantes/{estudianteId}', [PlanillaController::class, 'eliminarEstudianteDeTarea']);

    //Tarea
    Route::get('/tareas/sprints', [TareaController::class, 'mostrarSprints']);
    Route::get('/tareas/tareasEmpresa/{empresaId}', [TareaController::class, 'mostrarTodasLasTareas']);
    Route::get('/tareas/{sprintId}', [TareaController::class, 'mostrarTareas']);
    Route::get('/tareas/sprint/{sprintId}', [TareaController::class, 'mostrarTarea']);
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
    Route::get('/gestion', [CantidadGestionController::class, 'index']);


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

    //sprints
    Route::get('/listar-sprints', [SprintController::class, 'index']);

    //reportes
    Route::get('/reportes/autoevaluacion', [AutoevaluacionController::class, 'report']);
    Route::get('/reportes/evaluacionPares', [EvaluacionParesController::class, 'report']);
    Route::get('/reportes/cruzada', [CruzadaController::class, 'report']);

    // Rutas de Evaluación Cruzada
    Route::get('/cruzada/planillas', [PlanillaController::class, 'obtenerPlanillasCruzada']);
    Route::get('/cruzada/empresas', [CruzadaController::class, 'getEmpresas']);
    Route::get('/cruzada/empresas/{id}/estudiantes', [CruzadaController::class, 'getEstudiantesByEmpresa']);
    Route::post('/cruzada', [CruzadaController::class, 'guardarEvaluacion']);
    Route::get('/cruzada', [CruzadaController::class, 'obtenerEvaluaciones']);
    Route::get('/cruzada/equipos', [CruzadaController::class, 'getEquiposCruzada']);
    Route::post('/empresa/subir', [CruzadaController::class, 'guardarDriveYEspecificaciones']);
    Route::get('/empresa/detalle/{empresaId}', [CruzadaController::class, 'obtenerDriveYEspecificaciones']);
    Route::post('cruzada/guardar-nota', [CruzadaController::class, 'guardarNotaCruzada']);
    Route::get('cruzada/notas/{idEmpresa}', [CruzadaController::class, 'obtenerNotas']);
    Route::get('cruzada/mis-notas', [CruzadaController::class, 'obtenerMisNotas']);


    // Reportes por Equipo
    Route::post('/reporte', [ReporteController::class, 'generarReporte']);
    Route::get('/equiposGestion/{gestion}', [EmpresaController::class, 'getEquiposConEvaluaciones']);
    Route::get('/sprintsTareas/{equipoId}', [TareaController::class, 'getSprintsConTareas']);
    Route::get('empresa/{id_empresa}/reporte', [EmpresaController::class, 'getReporte']);

    // Reportes por Estudiante
    Route::get('/estudiante/{id_estudiante}/reporte', [EstudianteController::class, 'getStudentReport']);
    Route::get('/estudiante/{id_estudiante}/reporte', [ReporteController::class, 'getStudentReport']);


    //Configuración de notas
    Route::get('/configNotas', [NotaController::class, 'index']);
    Route::get('/configNotasDocente/{id_empresa}/{sprint}', [NotaController::class, 'show']);
    Route::get('/configNotasDocente/{id_empresa}/{sprint}', [NotaController::class, 'show']);
    Route::put('/configNotas', [NotaController::class, 'update']);
    Route::post('/configNotas', [NotaController::class, 'evaluacionConfig']);

    //Notificaciones
    Route::post('/notificacion', [NotificacionEstudiantesController::class, 'notificarEstudiantesPorGrupo']);
    Route::get('listaFechasEvaluciones', [NotificacionEstudiantesController::class, 'listaFechasEval']);
    Route::get('/cualificacion', [CualificarController::class, 'index']);

    //Planilla Notas
    Route::get('/equipos-planilla', [PlanillaNotasController::class, 'getEquipos']);
    Route::get('/equipos-planilla/{empresaId}/sprints', [PlanillaNotasController::class, 'getSprints']);
    Route::get('/equipos-planilla/{empresaId}/sprints/{sprintId}/nota-evaluacion', [PlanillaNotasController::class, 'mostrarNotaEvaluacion']);
    Route::get('/equipos-planilla/{empresaId}/sprints/{sprintId}/sumatoria-notas', [PlanillaNotasController::class, 'calcularSumatoriaNotas']);

    //Planillas Notas Finales
    Route::get('/equipos1', [PlanillaNotasFinalesController::class, 'getEquipos']);

    // Ruta para obtener los estudiantes y sus notas finales de una empresa
    Route::get('/estudiantes-con-notas/{empresaId}', [PlanillaNotasFinalesController::class, 'getEstudiantesConNotas']);

    // Ruta para actualizar las notas finales de una empresa
    Route::post('/actualizar-notas-finales/{empresaId}', [PlanillaNotasFinalesController::class, 'actualizarNotasFinales']);
}
);
Route::get('/estudiante/{id_estudiante}/reporte', [ReporteController::class, 'getStudentReport']);
