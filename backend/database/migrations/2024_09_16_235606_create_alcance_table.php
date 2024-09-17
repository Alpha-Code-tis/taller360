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
        Schema::create('alcance', function (Blueprint $table) {
            $table->integer('id_alcance')->unique('alcance_pk');
            $table->integer('id_sprint')->nullable()->index('tiene_sus_fk');
            $table->string('descripcion', 250)->nullable();

            $table->primary(['id_alcance']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('alcance');
    }
};
