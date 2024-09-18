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
        Schema::create('notificacion_doc', function (Blueprint $table) {
            $table->integer('id_noti')->primary();
            $table->string('descripcion_not', 150)->nullable();

            $table->unique(['id_noti'], 'notificacion_doc_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notificacion_doc');
    }
};
