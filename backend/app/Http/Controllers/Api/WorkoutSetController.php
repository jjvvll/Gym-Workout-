<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkoutSetResource;
use App\Models\Exercise;
use App\Models\ExerciseInstance;
use App\Models\WorkoutSet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class WorkoutSetController extends Controller
{
    public function index()
    {
        // Returns all workout sets with exercises
        return WorkoutSetResource::collection(WorkoutSet::with('exercises.instances')->get());
    }

    public function show($id)
    {
        return WorkoutSet::with('exercises.instances')->findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming JSON
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
            ]);

            // // Get the authenticated user's ID
            // $userId = Auth::id();  // Returns the user ID

            // // Add user_id to the data
            // $validated['user_id'] = $userId;

            //  Save to database
            $workoutSet = WorkoutSet::create($validated);

            //  Success response
            return response()->json([
                'success' => true,
                'message' => 'Workout set created successfully',
                'data' => new WorkoutSetResource($workoutSet),
            ], 201);
        } catch (\Throwable $e) {
            // Failure response (unexpected errors)
            return response()->json([
                'success' => false,
                'message' => 'Failed to create workout set',
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Validate incoming JSON
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
            ]);

            // Find the workout set or fail
            $workoutSet = WorkoutSet::findOrFail($id);

            // Update the database
            $workoutSet->update($validated);

            // Success response
            return response()->json([
                'success' => true,
                'message' => 'Workout set updated successfully',
                'data' => new WorkoutSetResource($workoutSet),
            ], 200);
        } catch (\Throwable $e) {
            // Failure response (unexpected errors)
            return response()->json([
                'success' => false,
                'message' => 'Failed to update workout set',
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Find the workout set or fail
            $workoutSet = WorkoutSet::findOrFail($id);

            // Delete it
            $workoutSet->delete();

            // Success response
            return response()->json([
                'success' => true,
                'message' => 'Workout set deleted successfully',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // If not found
            return response()->json([
                'success' => false,
                'message' => 'Workout set not found',
            ], 404);
        } catch (\Throwable $e) {
            // Any other errors
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete workout set',
            ], 500);
        }
    }
    public function generate(Request $request)
    {
        set_time_limit(600); // allow up to 10 minutes
        ini_set('max_execution_time', 600);

        DB::beginTransaction();

        $request->validate([
            'experience' => 'required|in:beginner,intermediate,pro',
            'goal' => 'required|in:fitness,build muscle,build strength',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'maxEffort' => 'required|boolean',
        ]);

        $user = $request->user();

        // Create AI prompt based on questionnaire
        $effort = $request->maxEffort ? "maximum effort" : "moderate effort";

        $setsReps = match ($request->goal) {
            'build muscle'   => ['sets' => 4, 'rest' => 90],
            'build strength' => ['sets' => 5, 'rest' => 180],
            'fitness'        => ['sets' => 3, 'rest' => 60],
            default          => ['sets' => 3, 'rest' => 90],
        };

        $weightRange = match ($request->experience) {
            'beginner'     => '5 to 20',
            'intermediate' => '20 to 60',
            'pro'          => '60 to 120',
            default        => '10 to 40',
        };

        $sets = $setsReps['sets'];
        $rest = $setsReps['rest'];

        $prompt = "You are an experienced personal trainer. Create a smart, personalized workout plan for this person.

        Person details:
        - Experience: {$request->experience}
        - Goal: {$request->goal}
        - Body weight: {$request->weight}kg
        - Height: {$request->height}cm
        - Effort: {$effort}

        You have full freedom to choose the best exercises, reps, and weights that suit this person's goal and experience. Be creative and make the plan genuinely effective.

        Guidelines (not strict rules):
        - Weight should generally be between {$weightRange}kg. Use 0 only for bodyweight exercises like push-ups or pull-ups.
        - weight_unit is always kg.
        - reps should never be 0. Choose reps that make sense for the goal.
        - rest time should make sense for the goal, around {$rest} seconds is a good starting point.

        THE ONLY STRICT RULE — instances:
        Each exercise must have exactly {$sets} instances in the instances array. Each instance represents one set. So {$sets} instances = {$sets} sets total.

        Correct structure ({$sets} instances):
        instances: [
        { weight: 25, weight_unit: \"kg\", reps: 10, sets: 1 },
        { weight: 27, weight_unit: \"kg\", reps: 8, sets: 1 },
        { weight: 30, weight_unit: \"kg\", reps: 6, sets: 1 }
        ]

        Wrong structure (only 1 instance — never do this):
        instances: [
        { weight: 25, weight_unit: \"kg\", reps: 10, sets: 3 }
        ]

        Notice in the correct example the weights and reps can vary between instances — that is fine and encouraged. What must never change is that there are always exactly {$sets} instances.

        Create exactly 4 workout days with exactly 4 exercises each.
        Day names: Monday Push Day, Wednesday Pull Day, Friday Leg Day, Sunday Full Body Day.";

        try {
            // // Call AI API (replace with your AI service)
            // $apiKey = config('services.google_ai.key'); // store your key in .env

            // $response = Http::withHeaders([
            //     'Content-Type' => 'application/json',
            //     'X-goog-api-key' => $apiKey,
            // ])->post('http://127.0.0.1:11434', [
            //     'contents' => [
            //         [
            //             'parts' => [
            //                 ['text' => $prompt],
            //             ],
            //         ],
            //     ],
            // ]);

            $response = Http::timeout(600)->post('http://127.0.0.1:11434/api/chat', [
                'model' => 'deepseek-r1:8b',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' =>  $prompt
                    ]
                ],
                'stream' => false,
                'format' => [
                    'type' => 'object',
                    'properties' => [
                        'workout_sets' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'name' => ['type' => 'string'],
                                    'description' => ['type' => 'string'],
                                    'exercises' => [
                                        'type' => 'array',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'name' => ['type' => 'string'],
                                                'description' => ['type' => 'string'],
                                                'restTime' => ['type' => 'integer'],
                                                'instances' => [
                                                    'type' => 'array',
                                                    'items' => [
                                                        'type' => 'object',
                                                        'properties' => [
                                                            'weight' => ['type' => 'integer'],
                                                            'weight_unit' => ['type' => 'string'],
                                                            'reps' => ['type' => 'integer'],
                                                            'sets' => ['type' => 'integer'],
                                                        ],
                                                        'required' => ['weight', 'weight_unit', 'reps', 'sets']
                                                    ]
                                                ]
                                            ],
                                            'required' => ['name', 'description', 'restTime', 'instances']
                                        ]
                                    ]
                                ],
                                'required' => ['name', 'description', 'exercises']
                            ]
                        ]
                    ],
                    'required' => ['workout_sets']
                ]
            ]);

            $rawContent = $response['message']['content']; // still a JSON string
            $workoutJson = json_decode($rawContent, true);  // converts into array

            $createdSets = [];

            foreach ($workoutJson['workout_sets'] as $setData) {
                $set = WorkoutSet::create([
                    'name' => $setData['name'],
                    'description' => $setData['description'],
                ]);

                foreach ($setData['exercises'] as $exerciseData) {
                    $exercise = $set->exercises()->create([
                        'name' => $exerciseData['name'],
                        'description' => $exerciseData['description'],
                        'restTime' => $exerciseData['restTime'],
                    ]);

                    foreach ($exerciseData['instances'] as $instanceData) {
                        $exercise->instances()->create([
                            'weight' => $instanceData['weight'],
                            'weight_unit' => $instanceData['weight_unit'],
                            'reps' => $instanceData['reps'],
                            'sets' => $instanceData['sets'],
                        ]);
                    }
                }

                $createdSets[] = $set->load('exercises.instances'); // eager load relations
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Workout generated successfully',
                'data' => $createdSets,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate workout',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
