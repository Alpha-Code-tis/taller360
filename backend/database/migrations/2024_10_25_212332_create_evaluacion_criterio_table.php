<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluacionCriterioTable extends Migration
{
    public function up()
    {
        Schema::create('evaluacion_criterio', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_cruzada');
            $table->unsignedBigInteger('id_criterio');
            $table->foreign('id_cruzada')->references('id_cruzada')->on('cruzada')->onDelete('cascade');
            $table->foreign('id_criterio')->references('id_criterio')->on('criterios')->onDelete('cascade');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('evaluacion_criterio');
    }    
}