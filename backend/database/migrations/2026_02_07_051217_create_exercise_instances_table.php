<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade'); // link to exercises
            $table->integer('weight')->nullable();
            $table->string('weight_unit')->default('lbs'); // can be lbs, kg, etc.
            $table->integer('reps')->nullable();
            $table->integer('sets')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_instances');
    }
};
