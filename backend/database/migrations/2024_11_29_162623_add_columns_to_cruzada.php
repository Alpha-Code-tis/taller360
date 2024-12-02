<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            // Asegúrate de que las columnas sean del mismo tipo que `id_empresa`
            if (!Schema::hasColumn('cruzada', 'equipo_evaluador_id')) {
                $table->integer('equipo_evaluador_id')->nullable()->after('id_cruzada');
            }
            if (!Schema::hasColumn('cruzada', 'equipo_evaluado_id')) {
                $table->integer('equipo_evaluado_id')->nullable()->after('equipo_evaluador_id');
            }
            if (!Schema::hasColumn('cruzada', 'gestion')) {
                $table->string('gestion')->nullable()->after('equipo_evaluado_id');
            }

            // Claves foráneas asegurando que el tipo coincida
            $table->foreign('equipo_evaluador_id')->references('id_empresa')->on('empresa')->onDelete('cascade');
            $table->foreign('equipo_evaluado_id')->references('id_empresa')->on('empresa')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            if (Schema::hasColumn('cruzada', 'equipo_evaluador_id')) {
                $table->dropForeign(['equipo_evaluador_id']);
                $table->dropColumn('equipo_evaluador_id');
            }
            if (Schema::hasColumn('cruzada', 'equipo_evaluado_id')) {
                $table->dropForeign(['equipo_evaluado_id']);
                $table->dropColumn('equipo_evaluado_id');
            }
            if (Schema::hasColumn('cruzada', 'gestion')) {
                $table->dropColumn('gestion');
            }
        });
    }
};
