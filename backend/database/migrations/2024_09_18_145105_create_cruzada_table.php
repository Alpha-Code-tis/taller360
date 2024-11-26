<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            // Agregar las nuevas columnas
            $table->unsignedBigInteger('equipo_evaluador_id')->nullable()->after('id_cruzada');
            $table->unsignedBigInteger('equipo_evaluado_id')->nullable()->after('equipo_evaluador_id');
            $table->string('gestion')->nullable()->after('equipo_evaluado_id');

            // Claves foráneas
            $table->foreign('equipo_evaluador_id')->references('id_empresa')->on('empresa')->onDelete('cascade');
            $table->foreign('equipo_evaluado_id')->references('id_empresa')->on('empresa')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            $table->dropForeign(['equipo_evaluador_id']);
            $table->dropForeign(['equipo_evaluado_id']);
            $table->dropColumn(['equipo_evaluador_id', 'equipo_evaluado_id', 'gestion']);
        });
    }
};

