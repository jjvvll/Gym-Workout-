<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;

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

    // Add this method to SettingsController.php
    public function uploadSound(Request $request)
    {
        $request->validate([
            'sound' => 'required|file|mimes:mp3,wav,ogg|max:5120',
        ]);

        $path = $request->file('sound')->store('sounds', 'public');

        // Use relative path instead of full URL
        $relativePath = 'storage/' . $path;

        Setting::updateOrCreate(
            ['user_id' => auth()->id(), 'key' => 'notification_sound'],
            ['value'   => $relativePath] // save relative path, not full URL
        );

        return response()->json([
            'success' => true,
            'message' => 'Sound uploaded successfully.',
            'data'    => ['notification_sound' => $relativePath],
        ]);
    }
}
