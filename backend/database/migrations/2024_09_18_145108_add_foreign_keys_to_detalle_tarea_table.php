<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Agregar la clave foránea correcta en 'id_tarea' que referencia a 'tarea'
        Schema::table('detalle_tarea', function (Blueprint $table) {
            $table->foreign('id_tarea')
                ->references('id_tarea') // Se asume que la tabla `docentes` tiene un campo `id`
                ->on('tarea')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        // Eliminar la clave foránea correcta
        Schema::table('detalle_tarea', function (Blueprint $table) {
            $table->dropForeign('tarea_detalle_fk');
        });

        // Restaurar la clave foránea incorrecta (opcional)
        Schema::table('detalle_tarea', function (Blueprint $table) {
            $table->foreign(['id_detalle_tarea'], 'fk_tarea_tiene_vari_detalle_tarea')->references(['id_detalle_tarea'])->on('detalle_tarea');
        });
    }
};
