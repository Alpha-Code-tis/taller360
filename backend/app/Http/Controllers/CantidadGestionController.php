<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use App\Models\Cantidad;
use Illuminate\Support\Facades\Validator;

class CantidadGestionController extends Controller
{
    // Almacenar nuevos datos de Gestion para el docente autenticado
    public function store(Request $request)
    {
        // Validar la entrada
        $validator = Validator::make($request->all(), [
            'gestion' => 'required|string|regex:/^[1-2]-\d{4}$/',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'cantidad_minima' => 'required|integer|min:0',
            'cantidad_maxima' => 'required|integer|min:cantidad_minima',
            'id_empresa' => 'required|exists:empresa,id_empresa'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Buscar la empresa
        $empresa = Empresa::find($request->id_empresa);
        if (!$empresa) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        // Actualizar los datos de gestion en la empresa
        $empresa->gestion = $request->gestion;
        $empresa->save();

        // Actualizar los datos de cantidad en la tabla Cantidad
        $cantidad = Cantidad::where('id_empresa', $request->id_empresa)->first();
        if (!$cantidad) {
            $cantidad = new Cantidad();
            $cantidad->id_empresa = $request->id_empresa;
        }

        $cantidad->fecha_ini = $request->fecha_inicio;
        $cantidad->fecha_final = $request->fecha_fin;
        $cantidad->cant_min = $request->cantidad_minima;
        $cantidad->cant_max = $request->cantidad_maxima;

        $cantidad->save();

        return response()->json(['message' => 'Gestion creada exitosamente', 'data' => $empresa], 201);
    }
}

