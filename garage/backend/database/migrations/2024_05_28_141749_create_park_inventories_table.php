<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('park_inventories', function (Blueprint $table) {
            $table->id();
            $table->integer('type');
            $table->unsignedBigInteger('park_id');
            $table->foreign('park_id')->references('id')->on('parks');
            $table->string('content');
            $table->boolean('defaultValue');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('park_inventories');
    }
};
