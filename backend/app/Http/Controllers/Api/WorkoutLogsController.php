<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExerciseInstance;
use App\Models\WorkoutLogs;
use Illuminate\Http\Request;

class WorkoutLogsController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'workout_set_id' => 'required|integer|exists:workout_sets,id',
            ]);

            // Manually check exercises since it's an object with dynamic keys
            $exercises = $request->input('exercises', []);

            if (count((array) $exercises) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No exercises provided.',
                ], 422);
            }

            $userId = auth()->id();
            $performedOn = now()->toDateString();
            $logsToInsert = [];

            // exercises = { "532": { "1397": { instance_id, is_completed, weight, reps } } }
            foreach ($request->input('exercises', []) as $exerciseId => $instances) {
                $exercise = Exercise::find((int) $exerciseId);

                if (!$exercise || !is_array($instances)) {
                    continue;
                }

                // Get only completed instance IDs
                $completedInstanceIds = collect($instances)
                    ->filter(
                        fn($instance) =>
                        is_array($instance) &&
                            isset($instance['is_completed']) &&
                            $instance['is_completed'] === true
                    )
                    ->keys()
                    ->map(fn($id) => (int) $id)
                    ->toArray();

                if (empty($completedInstanceIds)) {
                    continue;
                }

                // Fetch actual weight and reps from DB instead of trusting frontend
                $exerciseInstances = ExerciseInstance::whereIn('id', $completedInstanceIds)->get();

                if ($exerciseInstances->isEmpty()) {
                    continue;
                }

                // Group by weight and compute volume: sets x reps x weight
                $grouped = $exerciseInstances->groupBy('weight');

                foreach ($grouped as $weight => $instancesInGroup) {
                    $sets       = $instancesInGroup->count();
                    $totalReps  = $instancesInGroup->sum('reps');
                    $volume     = $sets * $totalReps * (float) $weight; // sets x reps x weight

                    $logsToInsert[] = [
                        'user_id'      => $userId,
                        'target_area'  => $exercise->target_area,
                        'weight'       => (float) $weight,
                        'sets'         => $sets,
                        'total_reps'   => $totalReps,
                        'volume'       => $volume,       // total tonnage lifted
                        'rest_time'    => $exercise->rest_time,
                        'performed_on' => $performedOn,
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ];
                }
            }

            if (!empty($logsToInsert)) {
                WorkoutLogs::insert($logsToInsert);
            }

            return response()->json([
                'success' => true,
                'message' => 'Workout logged successfully.',
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
