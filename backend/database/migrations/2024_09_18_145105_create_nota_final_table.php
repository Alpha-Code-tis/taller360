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
        Schema::create('nota_final', function (Blueprint $table) {
            $table->integer('id_nota_final', true);
            $table->integer('id_notas_sprint')->nullable()->index('tarea_fk');
            $table->integer('notas_cruzada')->nullable();
            $table->integer('nota_total_sprint')->nullable();
            $table->integer('nota_fin')->nullable();
            $table->integer('nota_valor_cruzada')->nullable();
            $table->integer('nota_valor_sprint')->nullable();

            $table->unique(['id_nota_final'], 'nota_fin_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nota_fin');
    }
};
