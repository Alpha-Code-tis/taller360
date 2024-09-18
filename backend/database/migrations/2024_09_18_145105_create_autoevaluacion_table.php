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
        Schema::create('autoevaluacion', function (Blueprint $table) {
            $table->integer('id_autoe', true);
            $table->integer('id_evaluacion')->nullable()->index('es_una2_fk');

            $table->unique(['id_autoe'], 'autoevaluacion_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('autoevaluacion');
    }
};
