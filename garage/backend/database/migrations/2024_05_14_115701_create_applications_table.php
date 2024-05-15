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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('manager_id');
            $table->unsignedBigInteger('division_id')->nullable();
            $table->string('advertising_source')->nullable();
            $table->unsignedBigInteger('booking_id')->nullable();
            $table->dateTime('planned_arrival')->nullable();
            $table->text('reason_for_rejection')->nullable();
            $table->string('current_status')->default('pending');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
