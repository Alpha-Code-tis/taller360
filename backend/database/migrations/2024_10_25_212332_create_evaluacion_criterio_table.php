<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluacionCriterioTable extends Migration
{
    public function up()
    {
        Schema::create('evaluacion_criterio', function (Blueprint $table) {
            $table->id(); // ID de la relación
            $table->unsignedBigInteger('id_criterio');
            $table->foreign('id_criterio')->references('id_criterio')->on('criterios')->onDelete('cascade');
            $table->integer('nota'); // Nota asignada al criterio en esa evaluación cruzada
            $table->timestamps(); // Timestamps para creación y actualización
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluacion_criterio');
    }
}