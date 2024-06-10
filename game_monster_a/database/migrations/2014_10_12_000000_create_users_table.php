<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('login')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('telNumber')->nullable();
            $table->string('nickName')->nullable();
            $table->integer('money')->default(0);
            $table->string('avatar')->nullable();;
            $table->string('password');
            $table->string('vk')->nullable();
            $table->string('steam')->nullable();
            $table->string('google')->nullable();
            $table->string('facebook')->nullable();
            $table->integer('admin')->default(0);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
