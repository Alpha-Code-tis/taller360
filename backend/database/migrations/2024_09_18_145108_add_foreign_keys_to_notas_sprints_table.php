<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notas_sprints', function (Blueprint $table) {
            $table->foreign(['id_tarea'], 'fk_notas_sprints_id_tarea')
                ->references(['id_tarea'])->on('tarea');

            $table->foreign('id_estudiante', 'fk_notas_sprints_id_estudiante')
                ->references('id_estudiante')->on('estudiante')->onDelete('cascade');

            $table->foreign('id_sprint', 'fk_notas_sprints_id_sprint')
                ->references('id_sprint')->on('sprint')->onDelete('cascade');
        });
    }

    /**
     * Revierte las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notas_sprints', function (Blueprint $table) {
            $table->dropForeign('fk_notas_sprints_id_tarea');
            $table->dropForeign('fk_notas_sprints_id_estudiante');
            $table->dropForeign('fk_notas_sprints_id_sprint');
        });
    }
};
