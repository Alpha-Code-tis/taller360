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
            'cantidad_maxima' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
       
            $cantidad = new Cantidad();
        $cantidad->fecha_ini = $request->fecha_inicio;
        $cantidad->fecha_final = $request->fecha_fin;
        $cantidad->cant_min = $request->cantidad_minima;
        $cantidad->cant_max = $request->cantidad_maxima;

        $cantidad->save();

        return response()->json(['message' => 'Gestion creada exitosamente', 'data' => $cantidad], 201);
    }
}

