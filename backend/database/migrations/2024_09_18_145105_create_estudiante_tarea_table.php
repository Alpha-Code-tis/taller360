<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estudiante_tarea', function (Blueprint $table) {
            $table->integer('id_estudiante')->index('idx_estudiante_tarea_estudiante');
            $table->integer('id_tarea')->index('idx_estudiante_tarea_tarea');

            // Definir la llave primaria compuesta para evitar duplicados
            $table->primary(['id_estudiante', 'id_tarea']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('estudiante_tarea');
    }
};
