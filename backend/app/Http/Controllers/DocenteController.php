<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Support\Facades\Notification;
use App\Notifications\DocenteRegistered;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\Administrador;
use App\Models\Estudiante;


class DocenteController extends Controller
{
    // Mostrar todos los docentes
    public function index()
    {
        $docente = Docente::with('grupo')->get(); // Incluir el grupo relacionado
        return response()->json($docente);
    }
    public function show($id)
    {
        $docente = Docente::find($id);

        if ($docente) {
            return response()->json($docente);
        } else {
            return response()->json(['error' => 'Docente no encontrado'], 404);
        }
    }

    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'id_grupo' => 'required|integer',
            'nombre_docente' => [
                'required',
                'string',
                'min:3',
                'max:35',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'ap_pat' => [
                'required',
                'string',
                'min:3',
                'max:35',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'ap_mat' => [
                'required',
                'string',
                'min:3',
                'max:35',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            ],
            'correo' => 'required|string|email|max:50|unique:docente,correo',
        ], [
            'id_grupo.required' => 'El grupo es obligatorio.',
            'nombre_docente.required' => 'El nombre del docente es obligatorio.',
            'ap_pat.required' => 'El apellido paterno es obligatorio.',
            'ap_mat.required' => 'El apellido materno es obligatorio.',
            'correo.required' => 'El correo electrónico es obligatorio.',
            'correo.email' => 'El correo electrónico debe ser válido.',
            'correo.unique' => 'El correo electrónico ya está en uso.',
        ]);

        // Generar una contraseña aleatoria
        $contrasenia = Str::random(10);

        try {
            // Crear el docente con los datos validados y la contraseña hasheada
            $docente = Docente::create([
                'id_grupo' => $validatedData['id_grupo'],
                'nombre_docente' => $validatedData['nombre_docente'],
                'ap_pat' => $validatedData['ap_pat'],
                'ap_mat' => $validatedData['ap_mat'],
                'correo' => $validatedData['correo'],
                'contrasenia' => bcrypt($contrasenia),
            ]);

            // Enviar notificación de registro
            try {
                $docente->notify(new DocenteRegistered($docente->correo, $docente->nombre_docente, $contrasenia));
            } catch (\Exception $e) {
                // Loguear el error pero continuar con la creación del docente
                
            }

            // Retornar la respuesta exitosa
            return response()->json([
                'message' => 'Docente agregado correctamente',
                'docente' => $docente
            ], 201);
        } catch (\Exception $e) {
            // Loguear el error y retornar una respuesta de error
           
            return response()->json(['error' => 'Error al crear el docente'], 500);
        }
    }

    public function loginWithToken(Request $request)
    {
        // Obtener el token desde la query string
        $token = $request->query('token');

        if (!$token) {
            return response()->json(['error' => 'Token no proporcionado'], 400);
        }

        // Verificar si el token es válido en la base de datos
        $tokenData = PersonalAccessToken::findToken($token);
        if (!$tokenData) {
            return response()->json(['error' => 'Token inválido'], 404);
        }

        // Obtener el usuario relacionado con el token
        $user = $tokenData->tokenable;

        // Verificar el rol del usuario y autenticar según corresponda
        if ($user instanceof Docente) {
            //auth()->login($user);
            return response()->json([
                'message' => 'Inicio de sesión exitoso (Docente)',
                'role' => 'Docente',
                'nombre' => $user->nombre_docente,
                'apellido_paterno' => $user->ap_pat,
                'apellido_materno' => $user->ap_mat,
                'correo' => $user->correo,
            ]);
        } elseif ($user instanceof Administrador) {
            //auth()->login($user);
            return response()->json([
                'message' => 'Inicio de sesión exitoso (Administrador)',
                'role' => 'Administrador',
                'nombre' => 'Administrador',
                'apellido_paterno' => '',
                'apellido_materno' => '',
                'correo' => $user->correo
            ]);
        } elseif ($user instanceof Estudiante) {
            //auth()->login($user);
            return response()->json([
                'message' => 'Inicio de sesión exitoso (Estudiante)',
                'role' => 'Estudiante',
                'nombre' => $user->nombre_estudiante,
                'apellido_paterno' => $user->ap_pat,
                'apellido_materno' => $user->ap_mat,
                'correo' => $user->correo
            ]);
        } else {
            return response()->json(['error' => 'Rol no reconocido'], 403);
        }
    }

    public function update(Request $request, $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json(['error' => 'Docente no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'id_grupo' => 'required|integer',
            'nombre_docente' => 'required|string|max:35',
            'ap_pat' => 'required|string|max:35',
            'ap_mat' => 'required|string|max:35',
            'contrasenia' => 'required|string|max:64',
            'correo' => 'required|string|email|max:50',
        ]);

        try {
            $docente->update([
                'id_grupo' => $validatedData['id_grupo'],
                'nombre_docente' => $validatedData['nombre_docente'],
                'ap_pat' => $validatedData['ap_pat'],
                'ap_mat' => $validatedData['ap_mat'],
                'correo' => $validatedData['correo'],
                'contrasenia' => bcrypt($validatedData['contrasenia']),
            ]);

            return response()->json($docente);
        } catch (\Exception $e) {
           
            return response()->json(['error' => 'Error al actualizar el docente'], 500);
        }
    }

    public function destroy($id)
    {
        $docente = Docente::find($id);

        if ($docente) {
            $docente->delete();
            return response()->json(['message' => 'Docente eliminado']);
        } else {
            return response()->json(['error' => 'Docente no encontrado'], 404);
        }
    }
}
