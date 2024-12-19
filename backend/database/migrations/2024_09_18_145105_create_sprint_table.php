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
        Schema::create('sprint', function (Blueprint $table) {
            $table->integer('id_sprint', true);
            $table->integer('id_planificacion')->nullable()->index('cuent_fk');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('color', 7)->nullable();
            $table->integer('nro_sprint')->nullable();
            $table->integer('porcentaje')->nullable();
            $table->integer('semanas_cant')->nullable();
            $table->json('revisado_semanas')->nullable();
            $table->unique(['id_sprint'], 'sprint_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sprint');
    }
};
