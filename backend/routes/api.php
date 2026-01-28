<?php

use App\Http\Controllers\Api\WorkoutSetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('workout-sets', [WorkoutSetController::class, 'index']);

Route::get('workout-sets/{id}', [WorkoutSetController::class, 'show']);
