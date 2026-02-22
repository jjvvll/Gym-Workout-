<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'user_id')->constrained()->cascadeOnDelete();
            $table->string('target_area')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->integer('sets')->default(1);
            $table->integer('total_reps')->nullable();
            $table->decimal('volume', 10, 2)->nullable(); // sets x reps x weight = total tonnage
            $table->integer('rest_time')->nullable();
            $table->date('performed_on');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_logs');
    }
};
