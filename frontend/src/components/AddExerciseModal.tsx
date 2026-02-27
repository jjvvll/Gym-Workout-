import { useState } from "react";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    target_area: string;
    description: string;
    is_bodyweight_exercise: boolean;
    restTime: number;
  }) => Promise<void>;
  workoutSetId: number;
}

const TARGET_AREAS = [
  {
    group: "Chest",
    options: [
      { value: "upper_chest", label: "Upper Chest" },
      { value: "middle_chest", label: "Middle Chest" },
      { value: "lower_chest", label: "Lower Chest" },
    ],
  },
  {
    group: "Shoulders",
    options: [
      { value: "front_deltoid", label: "Front Deltoid" },
      { value: "side_deltoid", label: "Side Deltoid" },
      { value: "rear_deltoid", label: "Rear Deltoid" },
    ],
  },
  {
    group: "Back",
    options: [
      { value: "upper_back", label: "Upper Back" },
      { value: "mid_back", label: "Mid Back" },
      { value: "lower_back", label: "Lower Back" },
      { value: "lats", label: "Lats" },
    ],
  },
  {
    group: "Arms",
    options: [
      { value: "biceps", label: "Biceps" },
      { value: "triceps", label: "Triceps" },
      { value: "forearms", label: "Forearms" },
    ],
  },
  {
    group: "Legs",
    options: [
      { value: "quadriceps", label: "Quadriceps" },
      { value: "hamstrings", label: "Hamstrings" },
      { value: "glutes", label: "Glutes" },
      { value: "calves", label: "Calves" },
    ],
  },
];

export default function AddExerciseModal({
  isOpen,
  onClose,
  onSave,
}: AddExerciseModalProps) {
  const [name, setName] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [description, setDescription] = useState("");
  const [isBodyweightExercise, setSsBodyweightExercise] = useState(false);
  const [minutes, setMinutes] = useState("1");
  const [seconds, setSeconds] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    targetArea?: string;
    restTime?: string;
  }>({});

  const handleMinutesChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setMinutes(value);
      setErrors((prev) => ({ ...prev, restTime: undefined }));
    }
  };

  const handleSecondsChange = (value: string) => {
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) < 60)) {
      setSeconds(value);
      setErrors((prev) => ({ ...prev, restTime: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; restTime?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Exercise name is required";
    }

    const totalSeconds =
      (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (totalSeconds <= 0) {
      newErrors.restTime = "Rest time must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const totalSeconds =
      (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        target_area: targetArea.trim(),
        description: description.trim(),
        is_bodyweight_exercise: isBodyweightExercise,
        restTime: totalSeconds,
      });
      console.log(isBodyweightExercise);
      handleClose();
    } catch (error) {
      console.error("Failed to add exercise", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setName("");
    setTargetArea("");
    setDescription("");
    setMinutes("1");
    setSeconds("0");
    setSsBodyweightExercise((prev) => !prev);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Add Exercise</h2>
        </div>
        {/* Content */}
        <div className="px-6 py-4 space-y-5">
          {/* Exercise Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g., Bench Press"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Area <span className="text-red-500">*</span>
            </label>
            <select
              value={targetArea}
              onChange={(e) => {
                setTargetArea(e.target.value);
                setErrors((prev) => ({ ...prev, targetArea: undefined }));
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                errors.targetArea ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select target area...</option>
              {TARGET_AREAS.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.targetArea && (
              <p className="text-red-500 text-sm mt-1">{errors.targetArea}</p>
            )}
          </div>

          {/* Bodyweight Checkbox */}
          <div
            onClick={() => setSsBodyweightExercise((prev) => !prev)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              isBodyweightExercise
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isBodyweightExercise
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {isBodyweightExercise && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Bodyweight Exercise
              </p>
              <p className="text-xs text-gray-500">
                No added weight (e.g. push-ups, pull-ups, planks)
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes or instructions..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Rest Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rest Time <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={minutes}
                  onChange={(e) => handleMinutesChange(e.target.value)}
                  className={`w-full px-4 py-2 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.restTime ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 text-center mt-1">
                  Minutes
                </p>
              </div>
              <span className="text-2xl font-bold text-gray-400">:</span>
              <div className="flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={seconds}
                  onChange={(e) => handleSecondsChange(e.target.value)}
                  className={`w-full px-4 py-2 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.restTime ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                  maxLength={2}
                />
                <p className="text-xs text-gray-500 text-center mt-1">
                  Seconds
                </p>
              </div>
            </div>
            {errors.restTime && (
              <p className="text-red-500 text-sm mt-1">{errors.restTime}</p>
            )}
            <p className="text-sm text-gray-600 mt-2 text-center">
              Total: {(parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)}{" "}
              seconds
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium"
          >
            {isSaving ? "Adding..." : "Add Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
}
