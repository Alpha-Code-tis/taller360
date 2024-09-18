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
        Schema::create('cantidad', function (Blueprint $table) {
            $table->integer('id_cantidad', true);
            $table->integer('id_empresa')->nullable()->index('relationship_20_fk');
            $table->integer('cantidad')->nullable();
            $table->integer('cant_min')->nullable();
            $table->integer('cant_max')->nullable();

            $table->unique(['id_cantidad'], 'cantidad_pk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cantidad');
    }
};
