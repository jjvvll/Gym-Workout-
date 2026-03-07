<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    // GET /api/settings — return all settings for current user
    public function index()
    {
        $settings = Setting::where('user_id', auth()->id())->get()
            ->mapWithKeys(fn($s) => [$s->key => $s->value]);

        return response()->json([
            'success' => true,
            'data'    => $settings,
        ]);
    }

    // GET /api/settings/{key} — return a single setting
    public function show($key)
    {
        $setting = Setting::where('user_id', auth()->id())
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => "Setting '{$key}' not found.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [$setting->key => $setting->value],
        ]);
    }

    // POST /api/settings — create or update a setting
    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'key'   => 'required|string|max:100',
            'value' => 'required|string|max:255',
        ]);

        $setting = Setting::updateOrCreate(
            ['user_id' => auth()->id(), 'key' => $validated['key']],
            ['value'   => $validated['value']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Setting saved.',
            'data'    => [$setting->key => $setting->value],
        ]);
    }

    public function uploadSound(Request $request)
    {
        try {
            $request->validate([
                'sound' => 'required|file|mimes:mp3,wav,ogg|max:5120',
            ]);

            // Check if user already has a sound saved
            $existingSetting = Setting::where('user_id', auth()->id())
                ->where('key', 'notification_sound')
                ->first();

            // Delete the old file if it exists
            if ($existingSetting) {
                // Convert relative path back to storage path
                // "storage/sounds/file.mp3" -> "sounds/file.mp3"
                $oldPath = str_replace('storage/', '', $existingSetting->value);

                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Store the new file
            $path = $request->file('sound')->store('sounds', 'public');
            $relativePath = 'storage/' . $path;

            // Update or create the setting
            Setting::updateOrCreate(
                ['user_id' => auth()->id(), 'key' => 'notification_sound'],
                ['value'   => $relativePath]
            );

            return response()->json([
                'success' => true,
                'message' => 'Sound uploaded successfully.',
                'data'    => ['notification_sound' => $relativePath],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => collect($e->errors())->flatten()->first(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload sound.',
            ], 500);
        }
    }

    public function uploadPhoto(Request $request)
    {
        try {
            $request->validate([
                'photo' => 'required|file|mimes:jpg,jpeg,png|max:20120',
            ]);

            $existingSetting = Setting::where('user_id', auth()->id())
                ->where('key', 'motivation_photo')
                ->first();

            if ($existingSetting) {
                $oldPath = str_replace('storage/', '', $existingSetting->value);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path         = $request->file('photo')->store('photos', 'public');
            $relativePath = 'storage/' . $path;

            Setting::updateOrCreate(
                ['user_id' => auth()->id(), 'key' => 'motivation_photo'],
                ['value'   => $relativePath]
            );

            return response()->json([
                'success' => true,
                'message' => 'Photo uploaded successfully.',
                'data'    => ['motivation_photo' => $relativePath],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => collect($e->errors())->flatten()->first(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload photo.',
            ], 500);
        }
    }
}
