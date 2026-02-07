<?php

use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\ExerciseInstanceController;
use App\Http\Controllers\Api\WorkoutSetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('workout-sets', [WorkoutSetController::class, 'index']);

Route::get('workout-sets/{id}', [WorkoutSetController::class, 'show']);

Route::put('workout-sets/{id}', [WorkoutSetController::class, 'update']);

Route::post('workout-sets', [WorkoutSetController::class, 'store']);

Route::delete('workout-sets/{id}', action: [WorkoutSetController::class, 'destroy']);


Route::post('exercises/{exerciseId}/instances', [ExerciseInstanceController::class, 'store']);
Route::delete('exercises/{exerciseId}/instances/latest', [ExerciseInstanceController::class, 'destroyLatest']);
Route::put(uri: 'exercise/instances/{id}', action: [ExerciseInstanceController::class, 'update']);

Route::put('exercises/{exerciseId}/rest-time', [ExerciseController::class, 'updateRestTime']);
