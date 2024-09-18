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
        Schema::table('detalle_reporte', function (Blueprint $table) {
            $table->foreign(['id_cruzada'], 'fk_detalle__cuenta_co_cruzada')->references(['id_cruzada'])->on('cruzada');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detalle_reporte', function (Blueprint $table) {
            $table->dropForeign('fk_detalle__cuenta_co_cruzada');
        });
    }
};
