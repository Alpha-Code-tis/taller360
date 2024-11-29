<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDriveAndEspecificacionesToEmpresaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empresa', function (Blueprint $table) {
            $table->string('drive_link')->nullable()->after('nombre_empresa'); // Campo para el enlace de Google Drive
            $table->text('especificaciones')->nullable()->after('drive_link'); // Campo para especificaciones
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empresa', function (Blueprint $table) {
            $table->dropColumn('drive_link');
            $table->dropColumn('especificaciones');
        });
    }
}

