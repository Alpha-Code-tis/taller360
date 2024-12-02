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
            
            // Campos de evaluación
            $table->integer('autoevaluacion');  // Nota de autoevaluación
            $table->integer('pares');          // Nota de evaluación por pares
            $table->integer('evaluaciondocente'); // Nota de evaluación docente
            
            // Relación con Docente
            $table->integer('id_docente');
            $table->foreign('id_docente')
                ->references('id_docente') // Se asume que la tabla `docentes` tiene un campo `id`
                ->on('docente')
                ->onDelete('cascade');

            // Relación con Empresa
            $table->integer('id_empresa'); // Llave foránea para empresa
            $table->foreign('id_empresa')
                ->references('id_empresa') // Se asume que la tabla `empresas` tiene un campo `id`
                ->on('empresa')
                ->onDelete('cascade');
            
            // Relación con Sprint
            $table->integer('id_sprint'); // Llave foránea para sprint
            $table->foreign('id_sprint')
                ->references('id_sprint') // Se asume que la tabla `sprints` tiene un campo `id`
                ->on('sprint')
                ->onDelete('cascade');

            $table->timestamps(); // Campos created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('notas');
    }
}
