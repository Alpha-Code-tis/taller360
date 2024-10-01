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
    public $url;

    public function __construct($nombre, $correo, $contrasenia, $url)
    {
        $this->correo = $correo;
        $this->contrasenia = $contrasenia;
        $this->nombre = $nombre;
        $this->url = $url;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Registro exitoso como docente')
            ->view('emails.docente_registered', [
                'nombre_docente' => $this->nombre,
                'correo' => $this->correo,
                'contrasenia' => $this->contrasenia,
                'url' => $this->url,
            ]);
    }
}
