<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales Taller360</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <style>
      /* Estilos generales */
      body {
        font-family: 'Arial', sans-serif;
      }

      /* Contenedor principal */
      .container {
        width: 579px;
        height: auto; /* Ajustable */
        transform: translate(80%, 20%);
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      header {
        background-color: #2D5981;
        text-align: center;
        padding: 20px;
        border-radius: 6px 6px 0 0;
      }

      header img {
        border-radius: 60%;
      }

      header h1 {
        color: #ffffff;
      }

      .content {
        margin: 10px;
        word-break: break-all;
        text-align: justify;
        font-size: 16px;
      }

      /* Footer */
      .footer {
        background-color: #2D5981;
        text-align: center;
        padding: 20px;
        border-radius: 0 0 6px 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        flex-wrap: wrap;
      }

      .footer .logo-container img {
        height: 40px;
        object-fit: contain;
      }

      .footer .social-icons {
        display: flex;
        gap: 15px;
      }

      .footer .social-icons a {
        color: white;
        font-size: 30px;
        text-decoration: none;
      }

      .footer .social-icons a:hover {
        opacity: 0.8;
      }

      /* Media queries para pantallas pequeñas (móviles) */
      @media screen and (max-width: 600px) {
        .container {
          width: 100%;
          transform: none; /* Eliminar el desplazamiento */
          margin: 0 auto;  /* Centrar en pantallas pequeñas */
          padding: 10px;
        }

        header img {
          width: 100px;
          height: 100px;
        }

        header h1 {
          font-size: 18px;
        }

        .footer {
          flex-direction: column;
          padding: 10px;
        }

        .footer .social-icons {
          justify-content: center;
          margin-top: 10px;
        }

        .footer .logo-container img {
          height: 30px;
        }
      }

      /* Media queries para pantallas medianas (tabletas) */
      @media screen and (min-width: 601px) and (max-width: 1024px) {
        .container {
          width: 90%;  /* Ajustar el ancho en tabletas */
          transform: none;
          margin: 0 auto;
        }

        header img {
          width: 120px;
          height: 100px;
        }

        header h1 {
          font-size: 20px;
        }

        .footer .logo-container img {
          height: 35px;
        }
      }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <img src="https://ideogram.ai/assets/image/lossless/response/9i8or4QuS1C3HbGI7l09cg" width="140" height="120">
            <h1>¡Bienvenido a Taller 360!</h1>
        </header>

        <div class="content">
            <p>Hola {{ $nombre_docente ?? 'Docente' }},</p>
            <p>Estamos muy contentos de tenerte a bordo. Estos son algunos de tus detalles: </p>
          <div style="margin-left: 10px">
              <p><strong>Usuario:</strong>
              <a href="mailto:sanchezmaria2c@gmail.com" target="_blank">{{ $correo }}</a>
              </p>
              <p><strong>contraseña:</strong><a>{{ $contrasenia }}</a></p>
              <p><strong>Plataforma: </strong>
              <a href="https://app.taller360.org/" target="_blank" data-saferedirecturl="http://localhost:3000/Estudiantes">https://app.taller360.org/</a>
              </p>
          </div>
        
            <p>Si tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.</p>
        
            <p>Saludos cordiales,<br>Equipo Taller 360<br>Alpha Code</p>
        </div>

        <footer class="footer">
      </footer>
    </div>
</body>
</html>

