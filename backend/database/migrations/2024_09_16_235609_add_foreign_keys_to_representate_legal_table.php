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
        Schema::table('representate_legal', function (Blueprint $table) {
            $table->foreign(['id_empresa'], 'fk_represen_inscribe_empresa')->references(['id_empresa'])->on('empresa');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('representate_legal', function (Blueprint $table) {
            $table->dropForeign('fk_represen_inscribe_empresa');
        });
    }
};
