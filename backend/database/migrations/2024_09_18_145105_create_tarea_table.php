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
        Schema::create('tarea', function (Blueprint $table) {
            $table->integer('id_tarea', true);
            $table->integer('id_alcance')->nullable()->index('tiene_varias_fk');
            $table->string('nombre_tarea', 35)->nullable();
            $table->string('estado', 12)->default('Pendiente');
            $table->string('progreso', 6)->default('0 %');
            $table->text('avances')->nullable()->change(); 
            $table->integer('estimacion')->nullable();
            $table->integer('calificacion')->nullable();
            $table->string('observaciones', 50)->nullable(); 
            $table->boolean('revisado')->default(false)->nullable();
            $table->unique(['id_tarea'], 'tarea_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarea');
    }
};
