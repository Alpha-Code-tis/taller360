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
        Schema::create('administrador', function (Blueprint $table) {
            $table->integer('id_admi', true);
            $table->string('nombre', 35)->nullable();
            $table->string('correo', 80)->nullable();
            $table->string('contrasenia', 64)->nullable();
            $table->unique(['id_admi'], 'administrador_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('administrador');
    }
};
