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
        Schema::table('alcance', function (Blueprint $table) {
            $table->foreign(['id_sprint'], 'fk_alcance_tiene_sus_sprint')->references(['id_sprint'])->on('sprint');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('alcance', function (Blueprint $table) {
            $table->dropForeign('fk_alcance_tiene_sus_sprint');
        });
    }
};
