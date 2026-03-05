import { useState, useEffect } from "react";
import type { Exercise, ExerciseInstance } from "../services/workoutService";
import TimerPopup from "./TimerPopup";
import { updateExercise } from "../services/exerciseService";
import type { setUpdateExercise } from "../services/exerciseService";
import type { InstanceProgress } from "../hooks/useWorkoutSession";
import RestNotification from "./RestNotification";
import { useAuth } from "../context/AuthContext";
import { getSoundUrl } from "../services/settingsService";

type WorkoutProgressRowProps = {
  exerciseInstance: ExerciseInstance;
  isBodyweightExercise: boolean;
  restTime: number;
  exerciseId: number;
  progress: InstanceProgress | null;
  onProgressChange: (
    instanceId: number,
    data: Partial<InstanceProgress>,
  ) => void;
};

export default function WorkoutProgressRow({
  exerciseInstance,
  isBodyweightExercise,
  restTime,
  exerciseId,
  progress,
  onProgressChange,
}: WorkoutProgressRowProps) {
  // Track checked exercises locally
  const [isChecked, setIsChecked] = useState<boolean>(
    progress?.is_completed ?? false,
  );
  const { settings } = useAuth();
  const weightUnit = settings.weight_unit ?? "kg";

  const soundUrl = settings.notification_sound
    ? getSoundUrl(settings.notification_sound)
    : "/sounds/notification-sound.mp3";

  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setTimeLeft(restTime);
  }, [restTime]);

  // --- weight state ---
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [weight, setWeight] = useState<number>(exerciseInstance.weight ?? 0);

  // --- reps state ---
  const [isEditingReps, setIsEditingReps] = useState(false);
  const [reps, setReps] = useState<number>(exerciseInstance.reps ?? 0);

  const saveWeight = async () => {
    const payload: setUpdateExercise = {
      action: "weight",
      weight: weight,
    };

    try {
      const res = await updateExercise(exerciseInstance.id, payload);

      if (res.success && res.data) {
        setWeight(res.data.weight ?? weight);
      }

      setIsEditingWeight(false);
    } catch (error) {
      console.error("Failed to update weight", error);
    }
  };

  const saveReps = async () => {
    const payload: setUpdateExercise = {
      action: "reps",
      reps: reps,
    };

    try {
      const res = await updateExercise(exerciseInstance.id, payload);

      if (res.success && res.data) {
        setReps(res.data.reps ?? reps);
      }

      setIsEditingReps(false);
    } catch (error) {
      console.error("Failed to update reps", error);
    }
  };

  const handleCheckboxChange = () => {
    const newValue = !isChecked;

    setIsChecked(newValue);
    onProgressChange(exerciseInstance.id, { is_completed: newValue });

    if (newValue) {
      setShowTimer(true);
    }
  };

  useEffect(() => {
    if (!showTimer) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCloseTimer();
          setShowNotification(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer]);

  const handleCloseTimer = () => {
    setTimeLeft(restTime);
    setShowTimer(false);
  };

  const handleStopNotification = () => {
    setShowNotification(false);
  };

  return (
    <div
      className="overflow-hidden rounded-xl border bg-white transition-all duration-200"
      style={{
        borderColor: isChecked ? "rgba(37,99,235,0.3)" : "#f3f4f6",
        boxShadow: isChecked
          ? "0 2px 12px rgba(37,99,235,0.08)"
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top accent bar — only shows when checked */}
      <div
        className="h-0.5 w-full transition-all duration-300"
        style={{
          background: isChecked
            ? "linear-gradient(to right, #2563eb, #60a5fa)"
            : "transparent",
        }}
      />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Radio-style checkbox */}
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onClick={handleCheckboxChange}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only peer"
          />
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
            {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>

        {/* Exercise details */}
        <div className="flex gap-2 items-center flex-1">
          {/* WEIGHT */}
          {isBodyweightExercise ? (
            <span
              className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(37,99,235,0.06)",
                color: "#2563eb",
                border: "1px solid rgba(37,99,235,0.15)",
                letterSpacing: "0.06em",
              }}
            >
              Bodyweight
            </span>
          ) : !isEditingWeight ? (
            <span
              onClick={() => setIsEditingWeight(true)}
              className="cursor-pointer text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all"
              style={{ letterSpacing: "0.06em" }}
            >
              {weight} {weightUnit}
            </span>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-20 px-2 py-1.5 text-sm font-bold border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={saveWeight}
                className="text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Save
              </button>
            </div>
          )}

          {/* REPS */}
          {!isEditingReps ? (
            <span
              onClick={() => setIsEditingReps(true)}
              className="cursor-pointer text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all"
              style={{ letterSpacing: "0.06em" }}
            >
              {reps} reps
            </span>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-20 px-2 py-1.5 text-sm font-bold border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={saveReps}
                className="text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Save
              </button>
            </div>
          )}

          {/* Completed badge */}
          {isChecked && (
            <span
              className="ml-auto text-xs font-black uppercase tracking-widest"
              style={{ color: "#2563eb", letterSpacing: "0.1em" }}
            >
              ✓ Done
            </span>
          )}
        </div>
      </div>

      {showTimer && (
        <TimerPopup
          restTime={restTime}
          timeLeft={timeLeft}
          onClose={handleCloseTimer}
        />
      )}

      <RestNotification
        isVisible={showNotification}
        onStop={handleStopNotification}
        soundUrl={soundUrl}
      />
    </div>
  );
}
