import { useState, useEffect } from "react";

interface EditTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: number; // in seconds
  onSave: (seconds: number) => Promise<void>;
  exerciseName?: string;
}

export default function EditTimerModal({
  isOpen,
  onClose,
  currentTime,
  onSave,
  exerciseName,
}: EditTimerModalProps) {
  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("0");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize values when modal opens
  useEffect(() => {
    if (isOpen) {
      const mins = Math.floor(currentTime / 60);
      const secs = currentTime % 60;
      setMinutes(mins.toString());
      setSeconds(secs.toString());
    }
  }, [isOpen, currentTime]);

  const handleMinutesChange = (value: string) => {
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setMinutes(value);
    }
  };

  const handleSecondsChange = (value: string) => {
    // Allow only numbers 0-59
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) < 60)) {
      setSeconds(value);
    }
  };

  const handleSave = async () => {
    const totalSeconds =
      (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

    if (totalSeconds < 0) return;

    setIsSaving(true);
    try {
      await onSave(totalSeconds);
      onClose();
    } catch (error) {
      console.error("Failed to save timer", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Edit Rest Timer
          {exerciseName && (
            <span className="text-gray-600 font-normal"> - {exerciseName}</span>
          )}
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rest Time
          </label>
          <div className="flex items-center gap-2">
            {/* Minutes */}
            <div className="flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => handleMinutesChange(e.target.value)}
                className="w-full px-4 py-2 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 text-center mt-1">Minutes</p>
            </div>

            <span className="text-2xl font-bold text-gray-400">:</span>

            {/* Seconds */}
            <div className="flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={seconds}
                onChange={(e) => handleSecondsChange(e.target.value)}
                className="w-full px-4 py-2 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                maxLength={2}
              />
              <p className="text-xs text-gray-500 text-center mt-1">Seconds</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-3 text-center">
            Total: {(parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)}{" "}
            seconds
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
