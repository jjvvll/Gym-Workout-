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

        // Create exercises (no reps/sets/weight here)
        $exercises = $set->exercises()->createMany([
            ['name' => 'Push-ups', 'restTime' => 60],
            ['name' => 'Pull-ups', 'restTime' => 60],
            ['name' => 'Dumbbell Shoulder Press', 'restTime' => 60],
        ]);

        // Create exercise instances for each exercise
        $exercises[0]->instances()->createMany([
            ['reps' => 15, 'sets' => 3, 'weight' => null, 'weight_unit' => 'body'],
        ]);

        $exercises[1]->instances()->createMany([
            ['reps' => 10, 'sets' => 3, 'weight' => null, 'weight_unit' => 'body'],
        ]);

        $exercises[2]->instances()->createMany([
            ['reps' => 12, 'sets' => 3, 'weight' => 15, 'weight_unit' => 'lbs'],
        ]);
    }
}
