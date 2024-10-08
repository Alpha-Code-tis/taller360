<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Docente;
use App\Models\Administrador;
use App\Models\Estudiante;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $correo = $validatedData['email'];
        $contrasenia = $validatedData['password'];

        // Intentar autenticar como Docente
        $docente = Docente::where('correo', $correo)->first();
        if ($docente && Hash::check($contrasenia, $docente->contrasenia)) {
            $token = $docente->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Inicio de sesión exitoso (Docente)',
                'role' => 'Docente',
                'nombre' => $docente->nombre_docente,
                'apellido_paterno' => $docente->ap_pat,
                'apellido_materno' => $docente->ap_mat,
                'correo' => $docente->correo,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        // Intentar autenticar como Administrador
        $admin = Administrador::where('correo', $correo)->first();
        if ($admin && Hash::check($contrasenia, $admin->contrasenia)) {
            $token = $admin->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Inicio de sesión exitoso (Administrador)',
                'role' => 'Administrador',
                'nombre' => 'Administrador', // Ajusta si tienes campos de nombre
                'correo' => $admin->correo,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        // Intentar autenticar como Estudiante
        $estudiante = Estudiante::where('correo', $correo)->first();
        if ($estudiante && Hash::check($contrasenia, $estudiante->contrasenia)) {
            $token = $estudiante->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Inicio de sesión exitoso (Estudiante)',
                'success' => true,
                'role' => 'Estudiante',
                'nombre' => $estudiante->nombre_estudiante,
                'apellido_paterno' => $estudiante->ap_pat,
                'apellido_materno' => $estudiante->ap_mat,
                'correo' => $estudiante->correo,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        // Si no se encuentra en ninguna tabla
        return response()->json(['error' => 'Credenciales incorrectas'], 401);
    }


    public function logout(Request $request)
    {
        // Revoca el token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout exitoso']);
    }
}
