<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;;

use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);

            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Fire registered event
            event(new Registered($user));

            // Log in user
            Auth::login($user);
            $request->session()->regenerate();

            // Return success JSON
            return response()->json([
                'message' => 'Registration successful',
                'user' => $user
            ], 201);
        } catch (ValidationException $e) {
            // Return all validation errors in a JSON-friendly format
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Catch any unexpected errors
            return response()->json([
                'message' => 'Something went wrong. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
