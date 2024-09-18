<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('representate_legal', function (Blueprint $table) {
            $table->integer('id_representante')->primary();
            $table->integer('id_empresa')->nullable()->index('inscribe_fk');
            $table->smallInteger('estado')->nullable();

            $table->unique(['id_representante'], 'representate_legal_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('representate_legal');
    }
};
