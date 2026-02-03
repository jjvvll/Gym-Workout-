import { useState } from "react";
import type { Exercise } from "../services/workoutService";
import TimerPopup from "./TimerPopup";

type WorkoutProgressRowProps = {
  exercise: Exercise;
};

export default function WorkoutProgressRow({
  exercise,
}: WorkoutProgressRowProps) {
  // Track checked exercises locally
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);

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
      <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
        {/* Radio-style checkbox */}
        <div className="relative flex-shrink-0">
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
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
            {exercise.weight} lbs
          </span>
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
            {exercise.reps} reps
          </span>
        </div>
      </label>

      {showTimer && (
        <TimerPopup restTime={exercise.restTime} onClose={handleCloseTimer} />
      )}
    </div>
  );
}
