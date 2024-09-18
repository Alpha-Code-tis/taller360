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
        Schema::table('empresa', function (Blueprint $table) {
            $table->foreign(['id_cantidad'], 'fk_empresa_relations_cantidad')->references(['id_cantidad'])->on('cantidad');
            $table->foreign(['id_representante'], 'fk_empresa_inscribe2_represen')->references(['id_representante'])->on('representate_legal');
            $table->foreign(['id_planificacion'], 'fk_empresa_tiene_planific')->references(['id_planificacion'])->on('planificacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empresa', function (Blueprint $table) {
            $table->dropForeign('fk_empresa_relations_cantidad');
            $table->dropForeign('fk_empresa_inscribe2_represen');
            $table->dropForeign('fk_empresa_tiene_planific');
        });
    }
};
