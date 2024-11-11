<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstudianteCriterioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estudiante_criterio', function (Blueprint $table) {
            $table->id();
            $table->integer('id_estudiante_evaluador');
            $table->foreign('id_estudiante_evaluador')->references('id_estudiante')->on('estudiante');
            $table->integer('id_estudiante_evaluado');
            $table->foreign('id_estudiante_evaluado')->references('id_estudiante')->on('estudiante');
            $table->foreignId('id_criterio')->constrained('criterios', 'id_criterio');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('estudiante_criterio');
    }
}
