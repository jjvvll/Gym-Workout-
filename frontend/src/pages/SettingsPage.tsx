// pages/SettingsPage.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleWeightUnit = async (value: "kg" | "lbs") => {
    setSaving(true);
    await updateSetting("weight_unit", value);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors shrink-0"
            aria-label="Go to home"
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
            </div>

            {/* Save feedback */}
            {saving && (
              <p className="text-xs text-blue-500 font-medium">Saving...</p>
            )}
            {saved && (
              <p className="text-xs text-green-500 font-medium">✓ Saved</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
