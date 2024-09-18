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
        Schema::table('detalle_par', function (Blueprint $table) {
            $table->foreign(['id_pares'], 'fk_detalle__cuenta_co_pares')->references(['id_pares'])->on('pares');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detalle_par', function (Blueprint $table) {
            $table->dropForeign('fk_detalle__cuenta_co_pares');
        });
    }
};
