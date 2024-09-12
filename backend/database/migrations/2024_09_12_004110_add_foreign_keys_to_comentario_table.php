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
        Schema::table('comentario', function (Blueprint $table) {
            $table->foreign(['id_alcance'], 'comentario_ibfk_1')->references(['id'])->on('alcance')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comentario', function (Blueprint $table) {
            $table->dropForeign('comentario_ibfk_1');
        });
    }
};
