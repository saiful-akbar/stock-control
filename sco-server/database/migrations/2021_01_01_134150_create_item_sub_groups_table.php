<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemSubGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_sub_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('item_g_code', 64);
            $table->string('item_s_g_code', 64)->unique();
            $table->text('item_s_g_name')->nullable();
            $table->timestamps();

            $table->foreign('item_g_code')
                ->references('id')
                ->on('item_groups')
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
        Schema::dropIfExists('item_sub_groups');
    }
}
