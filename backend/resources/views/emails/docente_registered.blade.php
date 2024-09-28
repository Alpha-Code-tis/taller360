<!DOCTYPE html>
<html>
<head>
    <title>Registro exitoso</title>
</head>
<body>
    <h1>Hola {{ $nombre_docente ?? 'Docente' }}</h1>
    <p>Tu cuenta ha sido creada con éxito.</p>
    <p><strong>Correo:</strong> {{ $correo }}</p>
    <p><strong>Contraseña:</strong> {{ $contrasenia }}</p>
    <a href=''>Iniciar sesión</a>
    <p>Gracias por usar nuestra aplicación!</p>
</body>
</html>
