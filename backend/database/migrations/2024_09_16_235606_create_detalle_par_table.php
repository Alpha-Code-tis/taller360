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
            $table->integer('id_det_par')->unique('detalle_rep_par_pk');
            $table->integer('id_pares')->nullable()->index('cuenta_con_fk');
            $table->string('descripcion_par', 250)->nullable();

            $table->primary(['id_det_par']);
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
