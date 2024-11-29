<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFechasToCruzadaTable extends Migration
{
    public function up()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            $table->date('fecha_inicio_cruzada')->nullable()->after('nota_cruzada');
            $table->date('fecha_fin_cruzada')->nullable()->after('fecha_inicio_cruzada');
        });
    }

    public function down()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            $table->dropColumn(['fecha_inicio_cruzada', 'fecha_fin_cruzada']);
        });
    }
}


