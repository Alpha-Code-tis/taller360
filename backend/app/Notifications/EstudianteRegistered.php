<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EstudianteRegistered extends Notification
{
    use Queueable;

    public $correo;
    public $contrasenia;
    public $nombre;

    public function __construct($nombre, $correo, $contrasenia)
    {
        $this->correo = $correo;
        $this->contrasenia = $contrasenia;
        $this->nombre = $nombre;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Registro exitoso como estudiante')
            ->view('emails.docente_registered', [
                'nombre_estudiante' => $this->nombre,
                'correo' => $this->correo,
                'contrasenia' => $this->contrasenia,
            ]);
    }
}
