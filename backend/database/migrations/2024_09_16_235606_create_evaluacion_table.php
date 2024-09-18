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
        Schema::create('evaluacion', function (Blueprint $table) {
            $table->integer('id_evaluacion')->primary();
            $table->integer('id_pares')->nullable()->index('es_fk');
            $table->integer('id_cruzada')->nullable()->index('es_un_fk');
            $table->integer('id_empresa')->nullable()->index('realiza_fk');
            $table->integer('id_autoe')->nullable()->index('es_una_fk');
            $table->integer('nota')->nullable();
            $table->time('tiempo')->nullable();

            $table->unique(['id_evaluacion'], 'evaluacion_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluacion');
    }
};
