<?php

use App\Http\Controllers\API\SprintController;
use App\Http\Controllers\API\PlanificacionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\DocenteController;
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

Route::post('planificacion',[SprintController::class, 'store']);
Route::get('planificacion/{id}',[PlanificacionController::class, 'show']);
Route::get('planificacion/{id}/sprint={n_sprint}', [PlanificacionController::class, 'showSprint']);
Route::get('/estudiantes', [EstudianteController::class, 'index']);
Route::get('/estudiantes/{id}', [EstudianteController::class, 'show']);
Route::post('/estudiantes', [EstudianteController::class, 'store']);
Route::put('/estudiantes/{id}', [EstudianteController::class, 'update']);
Route::delete('/estudiantes/{id}', [EstudianteController::class, 'destroy']);
Route::post('/estudiantes/import', [EstudianteController::class, 'import']);



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