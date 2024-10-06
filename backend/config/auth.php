<?php

return [

    'defaults' => [
        'guard' => 'web', // Considera cambiar a 'api' si tu aplicación es principalmente una API
        'passwords' => 'users',
    ],

    'guards' => [
        'docente' => [
            'driver' => 'sanctum', // Cambia a 'sanctum' si usas tokens
            'provider' => 'docentes',
        ],

        'admin' => [
            'driver' => 'sanctum', // Cambia a 'sanctum' si usas tokens
            'provider' => 'admins',
        ],

        'estudiante' => [
            'driver' => 'sanctum', // Cambia a 'sanctum' si usas tokens
            'provider' => 'estudiantes',
        ],

        // Guard por defecto
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'docentes' => [
            'driver' => 'eloquent',
            'model' => App\Models\Docente::class,
        ],

        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Administrador::class,
        ],

        'estudiantes' => [
            'driver' => 'eloquent',
            'model' => App\Models\Estudiante::class,
        ],

        // Provider por defecto
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,

];
