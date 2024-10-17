<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Obtener el usuario autenticado de cualquiera de los guards
        $user = Auth::guard('docente')->user() ?? Auth::guard('admin')->user() ?? Auth::guard('estudiante')->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Determinar el rol del usuario
        $userRole = null;
        if ($user instanceof \App\Models\Docente) {
            $userRole = 'docente';
        } elseif ($user instanceof \App\Models\Administrador) {
            $userRole = 'admin';
        } elseif ($user instanceof \App\Models\Estudiante) {
            $userRole = 'estudiante';
        }

        // Verificar si el rol está permitido
        if (!in_array($userRole, $roles)) {
            return response()->json(['error' => 'Acceso denegado'], 403);
        }

        return $next($request);
    }
}
