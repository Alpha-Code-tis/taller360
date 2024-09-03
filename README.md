# Proyecto de Evaluación Basada en Proyectos

<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400">
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.org/laravel/framework">
    <img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status">
  </a>
  <a href="https://packagist.org/packages/laravel/framework">
    <img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads">
  </a>
  <a href="https://packagist.org/packages/laravel/framework">
    <img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version">
  </a>
  <a href="https://packagist.org/packages/laravel/framework">
    <img src="https://img.shields.io/packagist/l/laravel/framework" alt="License">
  </a>
</p>

## Descripción

Este proyecto ha sido desarrollado en el marco del Taller de Ingeniería de Software de la Universidad, con el objetivo de crear una plataforma robusta y eficiente para la evaluación basada en proyectos. El sistema está diseñado para facilitar el seguimiento, evaluación y retroalimentación de los trabajos realizados por los equipos de estudiantes, garantizando una evaluación objetiva y estructurada.

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso del Sistema](#uso-del-sistema)
- [Contribución](#contribución)
- [Documentación Adicional](#documentación-adicional)
- [Licencia](#licencia)

## Características Principales

- **Gestión de Usuarios**: Registro y administración de docentes/tutores y equipos de estudiantes.
- **Planificación del Proyecto**: Los equipos pueden planificar su trabajo y generar planillas de seguimiento.
- **Evaluación Multimodal**: Evaluación cruzada, autoevaluación y evaluación de pares con planillas personalizadas.
- **Notificaciones**: Alertas y recordatorios automáticos sobre actividades y evaluaciones pendientes.
- **Reportes Dinámicos**: Generación de reportes detallados sobre el progreso y las evaluaciones de los proyectos.

## Arquitectura del Sistema

El sistema está construido sobre una arquitectura de tres capas que incluye la interfaz de usuario, la lógica de negocio y la capa de datos. La interacción entre estas capas garantiza que el sistema sea escalable, mantenible y fácil de actualizar.

- **Capa de Presentación**: Interfaz web responsive diseñada para ser accesible desde cualquier dispositivo.
- **Capa de Datos**: Gestión de la persistencia de datos utilizando MariaDB con un enfoque en la integridad y seguridad.

## Tecnologías Utilizadas

- **Laravel 10.x**: Framework PHP para el desarrollo de aplicaciones web.
- **MariaDB**: Sistema de gestión de bases de datos SQL, robusto y escalable.
- **Bootstrap 5**: Framework de diseño frontend para crear interfaces modernas y responsivas.
- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Vite**: Herramienta de construcción y bundling para aplicaciones modernas con React.
- **Docker**: Contenedores para desplegar el entorno de desarrollo de manera consistente.
- **Composer**: Herramienta para la gestión de dependencias en PHP.
- **Git**: Control de versiones para la gestión del código fuente.

## Instalación y Configuración

### Requisitos Previos

- **PHP 8.x**
- **Composer**
- **Docker** (opcional pero recomendado para despliegue)

### Pasos para la Instalación

1. **Clonar el repositorio**:

    ```bash
    git clone https://github.com/Alpha-Code-tis/tis-evalucion.git
    cd tis-evaluacion
    ```

2. **Instalar dependencias de PHP con Composer**:

    ```bash
    composer install
    ```

3. **Configurar las variables de entorno**:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Configurar la base de datos en el archivo `.env`**:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nombre_base_datos
    DB_USERNAME=usuario
    DB_PASSWORD=contraseña
    ```

5. **Migrar y sembrar la base de datos**:

    ```bash
    php artisan migrate --seed
    ```

6. **Iniciar el servidor local**:

    ```bash
    php artisan serve
    ```

### Despliegue con Docker

Si prefieres utilizar Docker, sigue estos pasos:

1. **Construir e iniciar los contenedores**:

    ```bash
    docker-compose up --build
    ```

2. **Acceder a la aplicación**:

    - **Laravel**: [http://localhost:8000](http://localhost:8000)
    - **React**: [http://localhost:3000](http://localhost:3000)

## Uso del Sistema

El sistema ofrece una interfaz intuitiva para que los usuarios puedan gestionar proyectos y evaluaciones de manera sencilla. Las funcionalidades principales incluyen:

- **Dashboard**
- **Gestión de Equipos**
- **Evaluaciones**

## Documentación Adicional

Para más detalles sobre la configuración avanzada, personalización y desarrollo del sistema, consulta la [documentación completa](enlace-a-documentacion-adicional).

## Contribución

Si estás interesado en contribuir al desarrollo de este proyecto, por favor revisa nuestras [pautas de contribución](enlace-a-pautas-de-contribucion). Apreciamos todas las formas de contribución, ya sea en la forma de código, reportes de errores, o sugerencias de nuevas funcionalidades.

## Licencia

Este proyecto está bajo la [MIT license](https://opensource.org/licenses/MIT). Para más detalles, revisa el archivo LICENSE.
