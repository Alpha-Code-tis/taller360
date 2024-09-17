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
            $table->integer('id_tarea')->unique('tarea_pk');
            $table->integer('id_alcance')->nullable()->index('tiene_varias_fk');
            $table->string('nombre_tarea', 35)->nullable();

            $table->primary(['id_tarea']);
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
