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
        Schema::create('empresa', function (Blueprint $table) {
            $table->integer('id_empresa', true);
            $table->integer('id_cantidad')->nullable()->index('relationship_19_fk');
            $table->integer('id_representante')->nullable()->index('inscribe2_fk');
            $table->integer('id_planificacion')->nullable()->index('tiene_fk');
            $table->string('nombre_empresa', 50)->nullable();
            $table->string('nombre_corto', 35)->nullable();
            $table->string('direccion', 250)->nullable();
            $table->string('telefono', 12)->nullable();
            $table->string('correo_empresa', 50)->nullable();

            $table->unique(['id_empresa'], 'empresa_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empresa');
    }
};
