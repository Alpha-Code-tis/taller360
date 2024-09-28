<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdEmpresaToEstudiantesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('estudiante', function (Blueprint $table) {
            $table->unsignedInteger('id_empresa')->nullable()->after('id_representante');
        });
    }

    public function down()
    {
        Schema::table('estudiante', function (Blueprint $table) {
            $table->dropColumn('id_empresa');
        });
    }
}
