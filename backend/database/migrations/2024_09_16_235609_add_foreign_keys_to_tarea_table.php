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
        Schema::table('tarea', function (Blueprint $table) {
            $table->foreign(['id_alcance'], 'fk_tarea_tiene_var_alcance')->references(['id_alcance'])->on('alcance');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tarea', function (Blueprint $table) {
            $table->dropForeign('fk_tarea_tiene_var_alcance');
        });
    }
};
