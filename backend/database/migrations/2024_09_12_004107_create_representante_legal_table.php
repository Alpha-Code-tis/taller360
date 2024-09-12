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
        Schema::create('representante_legal', function (Blueprint $table) {
            $table->integer('id_estudiante');
            $table->integer('id_grupo')->index('id_grupo');

            $table->primary(['id_estudiante', 'id_grupo']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('representante_legal');
    }
};
