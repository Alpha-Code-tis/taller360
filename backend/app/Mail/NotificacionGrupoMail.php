<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Docente;
use App\Models\Grupo;
use App\Models\Estudiante;

class NotificacionGrupoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $notificacion; // Estructura JSON que contiene el título, mensaje y detalles
    public $estudiante;

    public function __construct(array $notificacion, $estudiante)
    {
        $this->notificacion = $notificacion;
        $this->estudiante = $estudiante;
    }

    public function build()
    {
        return $this->view('emails.notificacion_grupo')
            ->subject($this->notificacion['titulo'])
            ->with([
                'notificacion' => $this->notificacion,
                'estudiante' => $this->estudiante,
            ]);
    }
}
