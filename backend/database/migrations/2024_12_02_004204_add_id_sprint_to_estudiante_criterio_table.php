<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdSprintToEstudianteCriterioTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('estudiante_criterio', function (Blueprint $table) {
            $table->integer('id_sprint')->nullable();
            $table->foreign('id_sprint')->references('id_sprint')->on('sprint')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estudiante_criterio', function (Blueprint $table) {
            $table->dropForeign(['id_sprint']);
            $table->dropColumn('id_sprint');
        });
    }
}

