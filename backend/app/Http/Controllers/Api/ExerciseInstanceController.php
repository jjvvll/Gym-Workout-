<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExerciseInstance;
use Illuminate\Http\Request;

class ExerciseInstanceController extends Controller
{
    // ExerciseInstanceController.php

    public function store(Request $request, int $exerciseId)
    {
        $exercise = Exercise::findOrFail($exerciseId);
        $lastInstance = $exercise->instances()->latest()->first();

        $newInstance = ExerciseInstance::create([
            'exercise_id' => $exercise->id,
            'weight' => $lastInstance->weight ?? null,
            'weight_unit' => $lastInstance->weight_unit ?? 'lbs',
            'reps' => $lastInstance->reps ?? 0,
            'sets' => $lastInstance->sets ?? 1,
            'restTime' => $lastInstance->restTime ?? 60,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New exercise instance added',
            'data' => $newInstance,
        ]);
    }

    public function destroyLatest(int $exerciseId)
    {
        $exercise = Exercise::findOrFail($exerciseId);
        $lastInstance = $exercise->instances()->latest()->first();

        if (!$lastInstance) {
            return response()->json([
                'success' => false,
                'message' => 'No exercise instance to remove',
            ], 400);
        }

        $lastInstance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Latest exercise instance removed',
        ]);
    }

    public function update($id, Request $request)
    {
        try {
            // Validate incoming request
            $validated = $request->validate([
                'weight' => ['nullable', 'integer', 'min:1', 'max:9999'], // max 4 digits
                'reps' => ['nullable', 'integer', 'min:1', 'max:999'],     // optional: max 3 digits
                'action' => ['required', 'in:weight,reps'],               // must be one of these
            ]);

            $exerciseInstance = ExerciseInstance::findOrFail($id);

            $action = $validated['action'];

            if ($action === 'weight') {
                // Only modify if provided
                $exerciseInstance->weight = $validated['weight'] ?? 0;
                $exerciseInstance->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Weight has been modified',
                    'data' => $exerciseInstance
                ], 200);
            } elseif ($action === 'reps') {
                $exerciseInstance->reps = $validated['reps'] ?? 0;
                $exerciseInstance->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Reps has been modified',
                    'data' => $exerciseInstance
                ], 200);
            }
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update exercise',
            ], 500);
        }
    }
}
