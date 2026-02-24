<?php

use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\ExerciseInstanceController;
use App\Http\Controllers\Api\WorkoutLogsController;
use App\Http\Controllers\Api\WorkoutSetController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);

// Registration
Route::post('/register', [RegisterController::class, 'register']);


// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Workout Sets
    Route::get('/workout-sets', [WorkoutSetController::class, 'index']);
    Route::get('/workout-sets/{id}', [WorkoutSetController::class, 'show']);
    Route::put('/workout-sets/{id}', [WorkoutSetController::class, 'update']);
    Route::post('/workout-sets', [WorkoutSetController::class, 'store']);
    Route::delete('/workout-sets/{id}', [WorkoutSetController::class, 'destroy']);

    // Exercise Instances
    Route::post('/exercises/{exerciseId}/instances', [ExerciseInstanceController::class, 'store']);
    Route::delete('/exercises/{exerciseId}/instances/latest', [ExerciseInstanceController::class, 'destroyLatest']);
    Route::put('/exercise/instances/{id}', [ExerciseInstanceController::class, 'update']);

    // Exercises
    Route::put('/exercises/{exerciseId}/rest-time', [ExerciseController::class, 'updateRestTime']);
    Route::post('/workout-sets/{workoutSetId}/exercise', [ExerciseController::class, 'store']);
    Route::delete('/exercises/{exerciseId}', [ExerciseController::class, 'destroy']);
    Route::put('/exercises/{id}/memo', [ExerciseController::class, 'updateMemo']);

    // api.php
    Route::post('/workout-logs', [WorkoutLogsController::class, 'store']);
    Route::get('/workout-logs/volume', [WorkoutLogsController::class, 'volumeOverTime']);
    Route::post('/workout-logs/analysis', [WorkoutLogsController::class, 'generateAnalysis']);
});
