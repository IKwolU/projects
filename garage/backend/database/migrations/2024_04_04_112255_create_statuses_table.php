<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatusesTable extends Migration
{
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('park_id');
            $table->string('status_name')->nullable();
            $table->string('status_value')->nullable();
            $table->string('custom_status_name');
            $table->timestamps();

            $table->foreign('park_id')->references('id')->on('parks');
        });
    }

    public function down()
    {
        Schema::dropIfExists('statuses');
    }
}
