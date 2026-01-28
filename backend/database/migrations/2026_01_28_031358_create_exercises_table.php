<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_set_id')->constrained()->cascadeOnDelete();
            // links exercise to workout set, deletes exercises if the set is deleted
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('restTime')->default(120); //rest time
            $table->integer('weight')->default(12); // optional reps
            $table->integer('reps')->nullable(); // optional reps
            $table->integer('sets')->nullable(); // optional sets
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
