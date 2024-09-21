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
        Schema::create('detalle_par', function (Blueprint $table) {
            $table->integer('id_det_par', true);
            $table->integer('id_pares')->nullable()->index('cuenta_con_fk');
            $table->string('descripcion_par', 250)->nullable();

            $table->unique(['id_det_par'], 'detalle_rep_par_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalle_par');
    }
};
