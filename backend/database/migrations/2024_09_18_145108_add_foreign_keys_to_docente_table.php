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
        Schema::table('docente', function (Blueprint $table) {
            $table->foreign(['id_grupo'], 'fk_docente_tiene_su_grupo')->references(['id_grupo'])->on('grupo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('docente', function (Blueprint $table) {
            $table->dropForeign('fk_docente_registra__administ');
            $table->dropForeign('fk_docente_le_llega_notifica');
            $table->dropForeign('fk_docente_tiene_su_grupo');
        });
    }
};
