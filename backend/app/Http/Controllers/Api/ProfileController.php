<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function updateEmail(Request $request)
    {
        try {
            $validated = $request->validate([
                'email'    => 'required|email|unique:users,email,' . auth()->id(),
                'password' => 'required|string',
            ]);

            $user = auth()->user();

            if (!Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password.',
                ], 422);
            }

            $user->update(['email' => $validated['email']]);

            return response()->json([
                'success' => true,
                'message' => 'Email updated successfully.',
                'data'    => ['email' => $user->email],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return the first validation error message
            return response()->json([
                'success' => false,
                'message' => collect($e->errors())->flatten()->first(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update email.',
            ], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password'     => 'required|string|min:8|confirmed',
            ]);

            $user = auth()->user();

            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.',
                ], 422);
            }

            $user->update([
                'password' => Hash::make($validated['new_password']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => collect($e->errors())->flatten()->first(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update password.',
            ], 500);
        }
    }
}
