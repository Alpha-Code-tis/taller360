<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDetalleNotasToCruzadaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            $table->json('detalle_notas')->nullable()->after('nota_cruzada');
        });
    }
    
    public function down()
    {
        Schema::table('cruzada', function (Blueprint $table) {
            $table->dropColumn('detalle_notas');
        });
    }
    
}
