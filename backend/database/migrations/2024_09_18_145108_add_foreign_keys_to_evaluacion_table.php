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
        Schema::table('evaluacion', function (Blueprint $table) {
            $table->foreign(['id_cruzada'], 'fk_evaluaci_es_un_cruzada')->references(['id_cruzada'])->on('cruzada');
            $table->foreign(['id_empresa'], 'fk_evaluaci_realiza_empresa')->references(['id_empresa'])->on('empresa');
            $table->foreign(['id_pares'], 'fk_evaluaci_es_pares')->references(['id_pares'])->on('pares');
            $table->foreign(['id_autoe'], 'fk_evaluaci_es_una_autoeval')->references(['id_autoe'])->on('autoevaluacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluacion', function (Blueprint $table) {
            $table->dropForeign('fk_evaluaci_es_un_cruzada');
            $table->dropForeign('fk_evaluaci_realiza_empresa');
            $table->dropForeign('fk_evaluaci_es_pares');
            $table->dropForeign('fk_evaluaci_es_una_autoeval');
        });
    }
};