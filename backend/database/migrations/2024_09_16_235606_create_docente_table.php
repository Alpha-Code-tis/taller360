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
        Schema::create('docente', function (Blueprint $table) {
            $table->integer('id_docente')->unique('docente_pk');
            $table->integer('id_noti')->nullable()->index('le_llega_fk');
            $table->integer('id_admi')->nullable()->index('registra_a_fk');
            $table->integer('id_grupo')->nullable()->index('tiene_su_fk');
            $table->string('nombre_docente', 35)->nullable();
            $table->string('ap_pat', 35)->nullable();
            $table->string('ap_mat', 35)->nullable();
            $table->string('contrasenia', 64)->nullable();
            $table->string('correo', 50)->nullable();

            $table->primary(['id_docente']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('docente');
    }
};
