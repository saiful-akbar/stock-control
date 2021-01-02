<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('item_s_g_code', 64);
            $table->string('item_code', 64)->unique();
            $table->string('item_barcode', 64)->unique();
            $table->text('item_name')->nullable();
            $table->enum('item_unit', ['PCS', 'SET', 'BOX', 'PACK', 'EACH'])->nullable();
            $table->double('item_price_normal')->nullable();
            $table->double('item_price_a')->nullable();
            $table->double('item_price_b')->nullable();
            $table->double('item_price_c')->nullable();
            $table->double('item_price_d')->nullable();
            $table->boolean('item_is_active');
            $table->timestamps();

            $table->foreign('item_s_g_code')
                ->references('item_s_g_code')
                ->on('item_sub_groups')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items');
    }
}
