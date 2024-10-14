<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('estudiante_tarea', function (Blueprint $table) {

            $table->foreign(['id_estudiante'], 'fk_estudiante_tarea_estudiante')
                  ->references(['id_estudiante'])
                  ->on('estudiante')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign(['id_tarea'], 'fk_estudiante_tarea_tarea')
                  ->references(['id_tarea'])
                  ->on('tarea')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
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
            $table->dropForeign('fk_estudiante_tarea_estudiante');
            $table->dropForeign('fk_estudiante_tarea_tarea');
        });
    }
};
