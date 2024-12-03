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
        Schema::create('notas_sprints', function (Blueprint $table) {
            $table->integer('id_notas_sprint', true);
            $table->integer('id_tarea')->nullable()->index('tarea_fk');
            $table->integer('nota_tarea')->nullable();
            $table->integer('nota_ev_pares')->nullable();
            $table->integer('nota_auto_ev')->nullable();

            $table->unique(['id_notas_sprint'], 'notas_sprints_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notas_sprints');
    }
};
