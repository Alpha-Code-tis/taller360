<!DOCTYPE html>
<html>
<head>
    <title>{{ $notificacion['titulo'] }}</title>
</head>
<body>
    <h1>Hola {{ $estudiante->nombre }}</h1>
    <p>{{ $notificacion['mensaje'] }}</p>

    <h3>Detalles:</h3>
    <ul>
        @if(isset($notificacion['detalles']['evaluacion_pares']))
            <li>
                <strong>Evaluación de Pares:</strong> <br>
                Inicio: {{ $notificacion['detalles']['evaluacion_pares']['inicio'] }} <br>
                Fin: {{ $notificacion['detalles']['evaluacion_pares']['fin'] }}
            </li>
        @endif

        @if(isset($notificacion['detalles']['autoevaluacion']))
            <li>
                <strong>Autoevaluación:</strong> <br>
                Inicio: {{ $notificacion['detalles']['autoevaluacion']['inicio'] }} <br>
                Fin: {{ $notificacion['detalles']['autoevaluacion']['fin'] }}
            </li>
        @endif

        @if(isset($notificacion['detalles']['porcentajes_pago']))
            <li>
                <strong>Porcentajes de Pago:</strong> <br>
                Primer Pago: {{ $notificacion['detalles']['porcentajes_pago']['primer_pago'] }}% <br>
                Segundo Pago: {{ $notificacion['detalles']['porcentajes_pago']['segundo_pago'] }}%
            </li>
        @endif
    </ul>

    <p>Saludos,<br>El equipo académico</p>
</body>
</html>
