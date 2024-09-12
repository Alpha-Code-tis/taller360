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
        Schema::table('representante_legal', function (Blueprint $table) {
            $table->foreign(['id_grupo'], 'representante_legal_ibfk_2')->references(['id'])->on('grupo')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['id_estudiante'], 'representante_legal_ibfk_1')->references(['id'])->on('estudiante')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('representante_legal', function (Blueprint $table) {
            $table->dropForeign('representante_legal_ibfk_2');
            $table->dropForeign('representante_legal_ibfk_1');
        });
    }
};
