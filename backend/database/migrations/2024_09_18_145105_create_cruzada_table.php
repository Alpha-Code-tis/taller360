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
        Schema::create('cruzada', function (Blueprint $table) {
            $table->integer('id_cruzada', true);
            $table->integer('id_evaluacion')->nullable()->index('es_un2_fk');

            $table->unique(['id_cruzada'], 'cruzada_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cruzada');
    }
};