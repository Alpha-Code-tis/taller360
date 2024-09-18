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
        Schema::table('estudiante', function (Blueprint $table) {
            $table->foreign(['id_grupo'], 'fk_estudian_pertenece_grupo')->references(['id_grupo'])->on('grupo');
            $table->foreign(['id_notificacion'], 'fk_estudian_llega_notifica')->references(['id_notificacion'])->on('notificacion');
            $table->foreign(['id_representante'], 'fk_estudian_registra_represen')->references(['id_representante'])->on('representate_legal');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('estudiante', function (Blueprint $table) {
            $table->dropForeign('fk_estudian_pertenece_grupo');
            $table->dropForeign('fk_estudian_llega_notifica');
            $table->dropForeign('fk_estudian_registra_represen');
        });
    }
};
