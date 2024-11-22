<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNotaParesToAjustesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ajustes', function (Blueprint $table) {
            $table->integer('nota_pares')->nullable(); // Asegúrate del tipo correcto.
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ajustes', function (Blueprint $table) {
            $table->dropColumn('nota_pares');
        });
    }
}
