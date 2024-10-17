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
        Schema::create('tarea', function (Blueprint $table) {
            $table->integer('id_tarea', true);
            $table->integer('id_alcance')->nullable()->index('tiene_varias_fk');
            $table->string('nombre_tarea', 35)->nullable();
            $table->integer('estimacion')->nullable();
            $table->unique(['id_tarea'], 'tarea_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarea');
    }
};
