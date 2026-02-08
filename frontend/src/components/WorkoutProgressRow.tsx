import { useState } from "react";
import type { Exercise, ExerciseInstance } from "../services/workoutService";
import TimerPopup from "./TimerPopup";
import { updateExercise } from "../services/exerciseService";
import type { setUpdateExercise } from "../services/exerciseService";

type WorkoutProgressRowProps = {
  exerciseInstance: ExerciseInstance;
  restTime: number;
};

export default function WorkoutProgressRow({
  exerciseInstance,
  restTime,
}: WorkoutProgressRowProps) {
  // Track checked exercises locally
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);

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
    setIsChecked((prev) => !prev);
    if (!isChecked) {
      setShowTimer(true);
    }
  };

  const handleCloseTimer = () => {
    setShowTimer(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        {/* Radio-style checkbox */}
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onClick={() => handleCheckboxChange()}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleCheckboxChange()}
            className="sr-only peer"
          />
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
            {isChecked && <div className="w-2 h-2 rounded-full bg-white"></div>}
          </div>
        </div>

        {/* Exercise details */}
        <div className="flex gap-3 items-center">
          {/* WEIGHT */}
          {!isEditingWeight ? (
            <span
              onClick={() => setIsEditingWeight(true)}
              className="cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md"
            >
              {weight} lbs
            </span>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border rounded-md"
              />
              <button
                onClick={saveWeight}
                className="text-sm px-2 py-1 rounded-md bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          )}

          {/* REPS */}
          {!isEditingReps ? (
            <span
              onClick={() => setIsEditingReps(true)}
              className="cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md"
            >
              {reps} reps
            </span>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border rounded-md"
              />
              <button
                onClick={saveReps}
                className="text-sm px-2 py-1 rounded-md bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {showTimer && (
        <TimerPopup restTime={restTime} onClose={handleCloseTimer} />
      )}
    </div>
  );
}
