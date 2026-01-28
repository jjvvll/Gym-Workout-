<?php

namespace Database\Seeders;

use App\Models\WorkoutSet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkoutSetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $set = WorkoutSet::create([
            'name' => 'Upper Body Strength',
            'description' => 'Focus on arms, chest, and shoulders',
        ]);

        $set->exercises()->createMany([
            ['name' => 'Push-ups', 'reps' => 15, 'sets' => 3],
            ['name' => 'Pull-ups', 'reps' => 10, 'sets' => 3],
            ['name' => 'Dumbbell Shoulder Press', 'reps' => 12, 'sets' => 3],
        ]);
    }
}
