<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDriveLinkAndEspecificacionesToCruzadaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::table('cruzada', function (Blueprint $table) {
        $table->string('drive_link')->nullable();
        $table->text('especificaciones')->nullable();
    });
}

public function down()
{
    Schema::table('cruzada', function (Blueprint $table) {
        $table->dropColumn('drive_link');
        $table->dropColumn('especificaciones');
    });
}

}
