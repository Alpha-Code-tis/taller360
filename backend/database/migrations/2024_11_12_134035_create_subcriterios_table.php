<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubcriteriosTable extends Migration
{
    public function up()
    {
        Schema::create('subcriterios', function (Blueprint $table) {
            $table->id('id_subcriterio');
            $table->foreignId('id_criterio')->references('id_criterio')->on('criterios')->onDelete('cascade');
            $table->string('descripcion');
            $table->integer('porcentaje')->default(0); // Porcentaje del subcriterio dentro del criterio
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('subcriterios');
    }
}