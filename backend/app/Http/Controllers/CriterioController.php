<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use App\Models\Tarea;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class CriterioController extends Controller
{
    // Obtener todos los criterios
    public function index()
    {
        $criterios = Criterio::all();
        return response()->json($criterios, Response::HTTP_OK);
    }

    // Almacenar un nuevo criterio
    public function store(Request $request)
    {
        $rules = [
            'nombre' => [
                'required',
                'string',
                'regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ,\.]+$/u'
            ],
            'descripcion' => [
                'required',
                'string',
                'regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ,\.]+$/u'
            ],
            'porcentaje' => 'required|integer|min:1|max:100',
        ];
            $messages = [
            'nombre.required' => 'El nombre es obligatorio.',
            'descripcion.required' => 'La descripción es obligatoria.',
            'porcentaje.required' => 'El porcentaje es obligatorio.',
            'porcentaje.integer' => 'El porcentaje debe ser un número entero.',
            'porcentaje.min' => 'El porcentaje debe ser al menos 1.',
            'porcentaje.max' => 'El porcentaje no puede ser mayor a 100.',
            'regex' => 'El campo :attribute tiene un formato inválido.',
        ];
            $validator = Validator::make($request->all(), $rules, $messages);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }   
        $porcentaje = Criterio::sum("porcentaje");
        if ($porcentaje + $request->porcentaje > 100) {
            return response()->json([
               'message' => 'La suma de los porcentajes no puede superar 100.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $criterio = Criterio::create($request->all());

        return response()->json([
            'message' => 'Criterio creado con éxito.',
            'data' => $criterio
        ], Response::HTTP_CREATED);
    }

    // Mostrar un criterio específico
    public function show($id_criterio)
    {
        $criterio = Criterio::where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json($criterio, Response::HTTP_OK);
    }

    // Actualizar un criterio existente
    public function update(Request $request, $id_criterio)
    {
        $rules = [
            'nombre' => [
                'required',
                'string',
                'regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ,\.]+$/u'
            ],
            'descripcion' => [
                'required',
                'string',
                'regex:/^(?!.*(.)\1{2})[\w\sñáéíóúüÑÁÉÍÓÚÜ,\.]+$/u'
            ],
            'porcentaje' => 'required|integer|min:1|max:100',
        ];
            $messages = [
            'nombre.required' => 'El nombre es obligatorio.',
            'descripcion.required' => 'La descripción es obligatoria.',
            'porcentaje.required' => 'El porcentaje es obligatorio.',
            'porcentaje.integer' => 'El porcentaje debe ser un número entero.',
            'porcentaje.min' => 'El porcentaje debe ser al menos 1.',
            'porcentaje.max' => 'El porcentaje no puede ser mayor a 100.',
            'regex' => 'El campo :attribute tiene un formato inválido.',
        ];
            $validator = Validator::make($request->all(), $rules, $messages);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }        

        $criterio = Criterio::where('id_criterio', $id_criterio)->first();

        if (!$criterio) {
            return response()->json([
                'message' => 'Criterio no encontrado.'
            ], Response::HTTP_NOT_FOUND);
        }
        $porcentaje = Criterio::where('id_criterio', '!=', $id_criterio)->sum('porcentaje');
        if ($porcentaje + $request->porcentaje > 100) {
            return response()->json([
                'message' => 'La suma de los porcentajes no puede superar 100.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $criterio->update($request->all());
        return response()->json([
            'message' => 'Criterio actualizado con éxito.',
            'data' => $criterio
        ], Response::HTTP_OK);
    }
    
      // Eliminar un criterio
      public function destroy($id_criterio)
      {
          $criterio = Criterio::where('id_criterio', $id_criterio)->first();
  
          if (!$criterio) {
              return response()->json([
                  'message' => 'Criterio no encontrado.'
              ], Response::HTTP_NOT_FOUND);
          }
  
          $criterio->delete();
  
          return response()->json([
              'message' => 'Criterio eliminado con éxito.'
          ], Response::HTTP_NO_CONTENT);
      }

    public function criteriosPorTarea($tareaId)
    {
        // Verificar que la tarea existe (opcional, si tienes un modelo Tarea)
        // Puedes omitir esto si no es necesario
        
        $tarea = Tarea::find($tareaId);
        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], Response::HTTP_NOT_FOUND);
        }
        

        // Obtener los criterios asociados a la tarea
        $criterios = Criterio::where('tarea_id', $tareaId)->get();

        if ($criterios->isEmpty()) {
            return response()->json(['message' => 'No hay criterios para esta tarea.'], Response::HTTP_OK);
        }

        return response()->json($criterios, Response::HTTP_OK);
    }
}