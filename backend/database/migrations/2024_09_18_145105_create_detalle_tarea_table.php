<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detalle_tarea', function (Blueprint $table) {
            $table->id('id_detalle_tarea'); // Clave primaria autoincremental
            $table->integer('id_tarea'); // Clave foránea
            $table->string('nom_estudiante', 35)->nullable();
            $table->string('nom_tarea', 35)->nullable();
            $table->string('calificacion_tarea')->nullable();
            $table->string('observaciones_tarea', 50)->nullable(); 
            $table->boolean('revisado_tarea')->default(false);
            $table->boolean('revisado_semanas')->default(false);
            $table->integer('semana_sprint')->nullable();
            $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('detalle_tarea');
    }
};
