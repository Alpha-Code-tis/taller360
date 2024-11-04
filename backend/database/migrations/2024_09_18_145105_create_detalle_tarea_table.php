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
        Schema::create('detalle_tarea', function (Blueprint $table) {
            $table->integer('id_detalle_tarea', true);
            $table->integer('id_tarea')->nullable()->index('tarea_detalle_fk');
            $table->string('nom_estudiante', 35)->nullable();
            $table->string('nom_tarea', 35)->nullable();
            $table->string('calificacion_tarea')->nullable();
            $table->string('observaciones_tarea', 50)->nullable(); 
            $table->boolean('revisado_tarea')->default(false)->nullable();
            $table->boolean('revisado_semanas')->default(false)->nullable();
            $table->integer('semana_sprint')->nullable();
            $table->unique(['id_detalle_tarea'], 'detalle_tarea_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalle_tarea');
    }
};
