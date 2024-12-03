<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDescripcionToCriteriosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('criterios', function (Blueprint $table) {
            $table->string('descripcion')->nullable()->after('nombre'); // Agrega la columna después de 'nombre'
        });
    }
    
    public function down()
    {
        Schema::table('criterios', function (Blueprint $table) {
            $table->dropColumn('descripcion');
        });
    }
    
}
