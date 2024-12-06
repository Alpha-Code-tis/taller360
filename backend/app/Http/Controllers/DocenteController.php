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
        $docentes = Docente::with('grupo')->get(); // Incluir el grupo relacionado
        return response()->json($docentes);
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
        $validatedData = $request->validate([
            'id_grupo' => 'required|integer',
            'nombre_docente' => 'required|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|min:3|max:35',
            'ap_pat' => 'required|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|min:3|max:35',
            'ap_mat' => 'required|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|min:3|max:35',
            'contrasenia' => 'required|string|max:64',
            'correo' => 'required|string|email|max:50',
        ],
        [
            'id_grupo.required' => 'El grupo es obligatorio.',
            'nombre_docente.required' => 'El nombre del docente es obligatorio.',
            'ap_pat.required' => 'El apellido paterno es obligatorio.',
            'ap_mat.required' => 'El apellido materno es obligatorio.',
            'contrasenia.required' => 'La contraseña es obligatoria.',
            'correo.required' => 'El correo electrónico es obligatorio.',
            'correo.email' => 'El correo electrónico debe ser válido.',
        ]
    );
        $contrasenia = Str::random(10);
        $docente = Docente::create(array_merge($validatedData, [
            'contrasenia' => bcrypt($contrasenia),
        ]));
        Notification::route('mail', $docente->correo)
            ->notify(new DocenteRegistered($docente->correo, $docente->nombre_docente, $contrasenia));
        return response()->json([
            'message' => 'Docente agregado correctamente',
            'docente' => $docente
        ], 201);
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
                'correo' => $user->correo
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

        $docente->update($validatedData);
        return response()->json($docente);
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
