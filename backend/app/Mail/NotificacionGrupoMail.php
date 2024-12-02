<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Estudiante;

class NotificacionGrupoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $notificacion;
    public $estudiante;
    public $docente;

    public function __construct($notificacion, Estudiante $estudiante, $docente)
    {
        $this->notificacion = $notificacion;
        $this->estudiante = $estudiante;
        $this->docente = $docente;
    }

    public function build()
    {
        return $this->subject($this->notificacion['titulo'])
                    ->view('emails.notificacion_grupo')
                    ->with([
                        'mensaje' => $this->notificacion['mensaje'],
                        'fechas' => $this->notificacion['fechas'],
                        'estudiante' => $this->estudiante,
                        'docente' => $this->docente,
                    ]);
    }
}
