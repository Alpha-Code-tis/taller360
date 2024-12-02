<!DOCTYPE html>
<html>
<head>
    <title>{{ $notificacion['titulo'] }}</title>
</head>
<body>
    <h1>{{ $notificacion['titulo'] }}</h1>
    <p>{{ $mensaje }}</p>

    @if(!empty($fechas))
        <h2>Fechas de Evaluación:</h2>
        <ul>
            @foreach($fechas as $tipo => $fecha)
                <li>
                    <strong>{{ ucfirst($tipo) }}:</strong>
                    Inicio: {{ \Carbon\Carbon::parse($fecha['fecha_inicio'])->format('d/m/Y') }},
                    Fin: {{ \Carbon\Carbon::parse($fecha['fecha_fin'])->format('d/m/Y') }}
                </li>
            @endforeach
        </ul>
    @endif

    <p>Saludos,<br>{{ config('app.name') }}</p>
</body>
</html>
