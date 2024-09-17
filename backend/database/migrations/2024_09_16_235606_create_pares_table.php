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
        Schema::create('pares', function (Blueprint $table) {
            $table->integer('id_pares')->primary();
            $table->integer('id_evaluacion')->nullable()->index('es2_fk');

            $table->unique(['id_pares'], 'pares_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pares');
    }
};
