<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNotaCruzadaToCruzadaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::table('cruzada', function (Blueprint $table) {
        $table->integer('nota_cruzada')->nullable()->after('especificaciones'); // Agrega la columna después de "especificaciones"
    });
}
public function down()
{
    Schema::table('cruzada', function (Blueprint $table) {
        $table->dropColumn('nota_cruzada');
    });
}


}
