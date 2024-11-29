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
        Schema::table('nota_final', function (Blueprint $table) {
            $table->foreign(['id_notas_sprint'], 'fk_nota_final_notas_sprints')->references(['id_notas_sprint'])->on('notas_sprints');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nota_final', function (Blueprint $table) {
            $table->dropForeign('fk_nota_final_notas_sprints');
        });
    }
};

