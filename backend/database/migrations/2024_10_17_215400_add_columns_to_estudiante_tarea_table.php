<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToEstudianteTareaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('estudiante_tarea', function (Blueprint $table) {
            $table->string('resultado_evaluacion')->nullable();
            $table->string('descripcion_evaluacion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('estudiante_tarea', function (Blueprint $table) {
            $table->dropColumn(['resultado_evaluacion', 'descripcion_evaluacion']);
        });
    }
}
