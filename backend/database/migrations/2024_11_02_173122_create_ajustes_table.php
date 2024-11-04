<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAjustesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ajustes', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_inicio_autoevaluacion')->nullable();
            $table->date('fecha_fin_autoevaluacion')->nullable();
            $table->date('fecha_inicio_eva_final')->nullable();
            $table->date('fecha_fin_eva_final')->nullable();
            $table->date('fecha_inicio_eva_cruzada')->nullable();
            $table->date('fecha_fin_eva_cruzada')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ajustes');
    }
}
