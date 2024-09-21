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
        Schema::table('detalle_auto', function (Blueprint $table) {
            $table->foreign(['id_autoe'], 'fk_detalle__contiene_autoeval')->references(['id_autoe'])->on('autoevaluacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detalle_auto', function (Blueprint $table) {
            $table->dropForeign('fk_detalle__contiene_autoeval');
        });
    }
};
