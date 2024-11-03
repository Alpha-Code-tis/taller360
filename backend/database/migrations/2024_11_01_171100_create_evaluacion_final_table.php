<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluacionFinalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluacion_final', function (Blueprint $table) {
            $table->id();
            $table->integer('id_est_evaluado');
            $table->integer('id_est_evaluador');
            $table->foreign('id_est_evaluado')->references('id_estudiante')->on('estudiante');
            $table->foreign('id_est_evaluador')->references('id_estudiante')->on('estudiante');
            $table->string('resultado_escala')->nullable();
            $table->string('resultado_comentario')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluacion_final');
    }
}
