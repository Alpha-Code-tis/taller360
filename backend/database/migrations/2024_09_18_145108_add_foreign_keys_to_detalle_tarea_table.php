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
        Schema::table('detalle_tarea', function (Blueprint $table) {
            $table->foreign(['id_detalle_tarea'], 'fk_tarea_tiene_vari_detalle_tarea')->references(['id_detalle_tarea'])->on('detalle_tarea');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detalle_tarea', function (Blueprint $table) {
            $table->dropForeign('fk_tarea_tiene_var_detalle_tarea');
        });
    }
};
