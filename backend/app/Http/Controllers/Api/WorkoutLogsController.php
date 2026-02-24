<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExerciseInstance;
use App\Models\WorkoutLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

    public function volumeOverTime(Request $request)
    {
        $validated = $request->validate([
            'year'  => 'nullable|integer|digits:4',
            'month' => 'nullable|integer|min:1|max:12',
        ]);

        $year  = $validated['year']  ?? now()->year;
        $month = $validated['month'] ?? now()->month;

        $logs = WorkoutLogs::where('user_id', auth()->id())
            ->whereYear('performed_on', $year)
            ->whereMonth('performed_on', $month)
            ->selectRaw('performed_on, SUM(volume) as total_volume')
            ->groupBy('performed_on')
            ->orderBy('performed_on', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $logs,
            'meta'    => [
                'year'  => $year,
                'month' => $month,
            ],
        ]);
    }

    public function generateAnalysis(Request $request)
    {
        set_time_limit(600);
        ini_set('max_execution_time', 600);

        try {
            $validated = $request->validate([
                'year'  => 'nullable|integer|digits:4',
                'month' => 'nullable|integer|min:1|max:12',
            ]);

            $year  = $validated['year']  ?? now()->year;
            $month = $validated['month'] ?? now()->month;
            $monthName = now()->setMonth($month)->format('F');

            // Fetch the user's volume data for the selected month
            $logs = WorkoutLogs::where('user_id', auth()->id())
                ->whereYear('performed_on', $year)
                ->whereMonth('performed_on', $month)
                ->selectRaw('performed_on, SUM(volume) as total_volume')
                ->groupBy('performed_on')
                ->orderBy('performed_on', 'asc')
                ->get();

            if ($logs->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No workout data found for this period.',
                ], 422);
            }

            // Format logs into readable text for the AI
            $logSummary = $logs->map(function ($log) {
                return "- {$log->performed_on}: " . number_format($log->total_volume, 2) . " kg total volume";
            })->implode("\n");

            $totalVolume    = $logs->sum('total_volume');
            $trainingDays   = $logs->count();
            $avgVolume      = round($totalVolume / $trainingDays, 2);

            $prompt = "You are an expert fitness coach analyzing a user's gym performance data.

            Here is the user's total workout volume data for {$monthName} {$year}:

            {$logSummary}

            Summary:
            - Total training days: {$trainingDays}
            - Total volume lifted: " . number_format($totalVolume, 2) . " kg
            - Average daily volume: {$avgVolume} kg

            Based on this data, provide a concise and motivating analysis. Include:
            1. Overall assessment of their training consistency
            2. Any noticeable trends (progression, regression, or plateau)
            3. One specific actionable recommendation to improve next month

            Keep the tone encouraging and professional. Be concise — no more than 4 sentences.";

            $response = Http::timeout(600)->post('http://127.0.0.1:11434/api/chat', [
                'model'    => 'deepseek-r1:8b',
                'messages' => [
                    [
                        'role'    => 'user',
                        'content' => $prompt,
                    ]
                ],
                'stream' => false,
                'format' => [
                    'type' => 'object',
                    'properties' => [
                        'success'  => ['type' => 'boolean'],
                        'message'  => ['type' => 'string'],
                    ],
                    'required' => ['success', 'message']
                ]
            ]);

            $rawContent = $response['message']['content'];
            $parsed     = json_decode($rawContent, true);

            return response()->json([
                'success' => true,
                'message' => $parsed['message'] ?? 'Analysis generated.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate analysis.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
