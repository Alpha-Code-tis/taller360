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
        Schema::create('detalle_reporte', function (Blueprint $table) {
            $table->integer('id_rep_det')->unique('reporte_detalle_pk');
            $table->integer('id_cruzada')->nullable()->index('cuenta_con_su_fk');
            $table->string('descripcion_cruzada', 250)->nullable();

            $table->primary(['id_rep_det']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalle_reporte');
    }
};
