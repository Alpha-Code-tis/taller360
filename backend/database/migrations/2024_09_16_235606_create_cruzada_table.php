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
            $table->integer('id_cruzada')->unique('cruzada_pk');
            $table->integer('id_evaluacion')->nullable()->index('es_un2_fk');

            $table->primary(['id_cruzada']);
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
