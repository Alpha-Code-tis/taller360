<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'planificacion'], // Incluye las rutas que quieres permitir

    'allowed_methods' => ['*'], // Permite todos los métodos (GET, POST, etc.)

    'allowed_origins' => ['http://localhost:3000'], // Permite localhost:3000

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Permite todos los headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];

