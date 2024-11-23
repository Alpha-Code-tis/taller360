<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotasTable extends Migration
{
    public function up()
    {
        Schema::create('notas', function (Blueprint $table) {
            $table->id();  // ID auto-incremental
            $table->integer('autoevaluacion');  // Campo para la autoevaluación
            $table->integer('pares');  // Campo para la evaluación por pares
            $table->integer('evaluaciondocente');  // Campo para la evaluación docente
            $table->integer('paga');  // Campo para la evaluación final

            // Define 'id_docente' as an integer to match the docente table
            $table->integer('id_docente');  // This should match the type of id_docente in the 'docente' table

            // Define the foreign key constraint
            $table->foreign('id_docente')
                ->references('id_docente')  // This should match the column name in the 'docente' table
                ->on('docente')
                ->onDelete('cascade');  // This ensures that related records are deleted if the referenced docente is deleted

            $table->timestamps();  // Para almacenar created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('notas');
    }
}

