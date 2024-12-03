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
        Schema::table('notas_sprints', function (Blueprint $table) {
            $table->foreign(['id_tarea'], 'fk_notas_sprints_id_tarea')->references(['id_tarea'])->on('tarea');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notas_sprints', function (Blueprint $table) {
            $table->dropForeign('fk_notas_sprints_id_tarea');
        });
    }
};

