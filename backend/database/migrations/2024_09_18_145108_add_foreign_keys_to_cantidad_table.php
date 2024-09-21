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
        Schema::table('cantidad', function (Blueprint $table) {
            $table->foreign(['id_empresa'], 'fk_cantidad_relations_empresa')->references(['id_empresa'])->on('empresa');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cantidad', function (Blueprint $table) {
            $table->dropForeign('fk_cantidad_relations_empresa');
        });
    }
};
