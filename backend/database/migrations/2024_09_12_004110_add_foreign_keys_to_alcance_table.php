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
            $table->foreign(['id_sprint'], 'alcance_ibfk_1')->references(['id'])->on('sprint')->onUpdate('NO ACTION')->onDelete('NO ACTION');
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
            $table->dropForeign('alcance_ibfk_1');
        });
    }
};
