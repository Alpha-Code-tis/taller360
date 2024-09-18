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
        Schema::create('detalle_auto', function (Blueprint $table) {
            $table->integer('id_rep_auto')->unique('detalle_rep_auto_pk');
            $table->integer('id_autoe')->nullable()->index('contiene_fk');
            $table->string('descripcion_auto', 250)->nullable();

            $table->primary(['id_rep_auto']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalle_auto');
    }
};
