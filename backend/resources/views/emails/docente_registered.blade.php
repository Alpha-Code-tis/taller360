<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales Taller360</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <style>
      .footer {
        background-color: #2D5981;
        text-align: center;
        padding: 20px;
        border-radius: 0 0 6px 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
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
    </style>
</head>
<body >
    <div  style= "width: 579px; height: 200px;transform: translate(80%, 20%);">
        <header style="background-color: #2D5981; text-align: center; padding: 20px; border-radius: 6px 6px 0px 0px; height: 170px">
            <img src="https://ideogram.ai/assets/image/lossless/response/9i8or4QuS1C3HbGI7l09cg" width="140" height="120"
            style="border-radius: 60%">
            <h1 style="color:#ffff">¡Bienvenido a Taller 360!</h1>

        </header>

        <div style="margin: 10px; word-break: break-all; text-align:justify; font-family: 'Arial', sans-serif; font-size: 16px;">
            <p>Hola {{ $nombre_docente ?? 'Docente' }},</p>
            <p>Estamos muy contentos de tenerte a bordo. Estos son algunos de tus detalles: </p>
          <div style="margin-left: 110px">
              <p><strong>Usuario:</strong>
              <a href="mailto:sanchezmaria2c@gmail.com" target="_blank">{{ $correo }}</a>
              </p>
              <p><strong>contraseña:</strong><a>{{ $contrasenia }}</a></p>
              <p><strong>Plataforma: </strong>
              <a href="{{ $url }}" target="_blank">Acceder con el token</a>  
              </p>
          </div>
        
            <p>Si tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.</p>
        
            <p>Saludos cordiales,
            <br>
                Equipo Taller 360 
            <br>
                Alpha Code 
            </p>

        </div>
        <footer class="footer">
          <div class="logo-container">
              <img src="./assets/logoALPHA.png" alt="Logo de la Empresa" />
          </div>
          <div class="social-icons">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-linkedin"></i>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-facebook"></i>
              </a>
          </div>
      </footer>

    </div>
</body>
</html>
