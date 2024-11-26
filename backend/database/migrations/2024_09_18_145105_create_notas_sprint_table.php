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
        Schema::create('notas', function (Blueprint $table) {
            $table->integer('id_notas', true);
            $table->integer('id_tarea')->index('tarea_fk');
            $table->integer('NotaTarea')->nullable();
            $table->integer('NotaEvPares')->nullable();
            $table->integer('NotaAutoEv')->nullable();
            $table->integer('Identifier_1')->nullable()->index('identifier_1_fk');
            
            $table->foreign('id_tarea')->references('id_tarea')->on('tarea')->onDelete('cascade');
            $table->unique(['id_notas'], 'notas_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notas');
    }
};
