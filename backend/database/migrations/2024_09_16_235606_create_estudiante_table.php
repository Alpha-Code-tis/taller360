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
        Schema::create('estudiante', function (Blueprint $table) {
            $table->integer('id_estudiante')->primary();
            $table->char('id_notificacion', 10)->nullable()->index('llega_fk');
            $table->integer('id_grupo')->nullable()->index('pertenece_fk');
            $table->integer('id_representante')->nullable()->index('registra_fk');
            $table->string('nombre_estudiante', 35)->nullable();
            $table->string('ap_pat', 35)->nullable();
            $table->string('ap_mat', 35)->nullable();
            $table->integer('codigo_sis')->nullable();
            $table->string('correo', 50)->nullable();
            $table->string('contrasenia', 64)->nullable();

            $table->unique(['id_estudiante'], 'estudiante_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('estudiante');
    }
};
