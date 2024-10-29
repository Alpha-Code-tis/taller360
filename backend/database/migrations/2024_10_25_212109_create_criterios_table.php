<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCriteriosTable extends Migration
{
    public function up()
    {
        Schema::create('criterios', function (Blueprint $table) {
            $table->id('id_criterio'); // ID único del criterio
            $table->string('nombre'); // Nombre del criterio (e.g., "Trabajo en equipo")
            $table->text('descripcion')->nullable(); // Descripción opcional del criterio
            $table->decimal('ponderacion', 5, 2); // Ponderación (peso) del criterio
            $table->timestamps(); // Timestamps para creación y actualización
        });
    }

    public function down()
    {
        Schema::dropIfExists('criterios');
    }
}
