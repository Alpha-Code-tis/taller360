<?php

use App\Http\Controllers\API\SprintController;
use App\Http\Controllers\API\PlanificacionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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