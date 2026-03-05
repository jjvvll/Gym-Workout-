import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadNotificationSound } from "../services/settingsService";
import { getSoundUrl } from "../services/settingsService";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [soundSaving, setSoundSaving] = useState(false);
  const [soundSaved, setSoundSaved] = useState(false);
  const [soundError, setSoundError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleWeightUnit = async (value: "kg" | "lbs") => {
    setSaving(true);
    await updateSetting("weight_unit", value);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSoundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSoundSaving(true);
    setSoundError(null);

    try {
      const response = await uploadNotificationSound(file);
      if (response.success) {
        // Update local settings state with new sound URL
        await updateSetting(
          "notification_sound",
          response.data.notification_sound ?? "",
        );
        setSoundSaved(true);
        setTimeout(() => setSoundSaved(false), 2000);
      }
    } catch {
      setSoundError("Failed to upload sound. Max 5MB, mp3/wav/ogg only.");
    } finally {
      setSoundSaving(false);
    }
  };

  // Add this useEffect alongside your other hooks
  useEffect(() => {
    // Cleanup function runs when component unmounts (user navigates away)
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
        previewAudioRef.current = null;
      }
    };
  }, []); // empty array = only runs cleanup on unmount

  const handlePreviewSound = () => {
    const soundUrl = settings.notification_sound
      ? getSoundUrl(settings.notification_sound)
      : "/sounds/notification-sound.mp3";

    if (!soundUrl) return;

    // If already playing, stop it
    if (isPreviewing && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
      setIsPreviewing(false);
      return;
    }

    // Start playing
    const audio = new Audio(soundUrl);
    previewAudioRef.current = audio;
    setIsPreviewing(true);

    audio.play().catch(() => setSoundError("Failed to preview sound."));

    // Auto-reset when sound finishes
    audio.onended = () => {
      setIsPreviewing(false);
      previewAudioRef.current = null;
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors shrink-0"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-9 5v6h4v-6m-4 0H9m6 0h-2"
              />
            </svg>
          </button>
          <div>
            <h1
              className="text-2xl font-black uppercase text-gray-900"
              style={{ letterSpacing: "0.1em" }}
            >
              Settings
            </h1>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />

          <div className="p-5 space-y-6">
            {/* Weight Unit */}
            <div>
              <label
                className="block text-xs font-black uppercase text-gray-400 mb-3"
                style={{ letterSpacing: "0.1em" }}
              >
                Weight Unit
              </label>
              <div className="flex gap-3">
                {(["kg", "lbs"] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleWeightUnit(unit)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-black uppercase tracking-wide border transition-all"
                    style={{
                      letterSpacing: "0.08em",
                      background:
                        settings.weight_unit === unit
                          ? "#2563eb"
                          : "transparent",
                      color: settings.weight_unit === unit ? "#fff" : "#6b7280",
                      borderColor:
                        settings.weight_unit === unit ? "#2563eb" : "#e5e7eb",
                    }}
                  >
                    {unit}
                  </button>
                ))}
              </div>
              {saving && (
                <p className="text-xs text-blue-500 font-medium mt-2">
                  Saving...
                </p>
              )}
              {saved && (
                <p className="text-xs text-green-500 font-medium mt-2">
                  ✓ Saved
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Notification Sound */}
            <div>
              <label
                className="block text-xs font-black uppercase text-gray-400 mb-3"
                style={{ letterSpacing: "0.1em" }}
              >
                Notification Sound
              </label>

              {/* Current sound */}
              {settings.notification_sound ? (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <svg
                    className="w-4 h-4 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span className="text-xs text-gray-500 flex-1 truncate">
                    {settings.notification_sound.split("/").pop()}
                  </span>
                  <button
                    onClick={handlePreviewSound}
                    className="text-xs font-bold text-blue-500 hover:text-blue-600 shrink-0"
                  >
                    {isPreviewing ? "■ Stop" : "▶ Preview"}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">
                  No custom sound set. Using default.
                </p>
              )}

              {/* Upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.ogg"
                onChange={handleSoundUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={soundSaving}
                className="w-full py-2.5 rounded-lg text-sm font-black uppercase tracking-wide border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50"
                style={{ letterSpacing: "0.08em" }}
              >
                {soundSaving ? "Uploading..." : "⬆ Upload Sound"}
              </button>

              {soundSaved && (
                <p className="text-xs text-green-500 font-medium mt-2">
                  ✓ Sound saved
                </p>
              )}
              {soundError && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  {soundError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
