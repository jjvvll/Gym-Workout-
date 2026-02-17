import { useState } from "react";
import type { GenerateWorkoutPayload } from "../services/workoutService";

interface GenerateWorkoutModalProps {
  onClose: () => void;
  onGenerate: (payload: GenerateWorkoutPayload) => void;
  isLoading: boolean;
}

export default function GenerateWorkoutModal({
  onClose,
  onGenerate,
  isLoading,
}: GenerateWorkoutModalProps) {
  const [experience, setExperience] =
    useState<GenerateWorkoutPayload["experience"]>("beginner");
  const [goal, setGoal] =
    useState<GenerateWorkoutPayload["goal"]>("build muscle");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [maxEffort, setMaxEffort] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0)
      newErrors.weight = "Please enter a valid weight";
    if (!height || isNaN(Number(height)) || Number(height) <= 0)
      newErrors.height = "Please enter a valid height";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onGenerate({
      experience,
      goal,
      weight: Number(weight),
      height: Number(height),
      maxEffort,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Generate Workout</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Answer a few questions so AI can build your plan
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-5">
          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["beginner", "intermediate", "pro"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                    experience === level
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["fitness", "build muscle", "build strength"] as const).map(
                (g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`py-2 px-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                      goal === g
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {g}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setErrors((prev) => ({ ...prev, weight: "" }));
                  }}
                  placeholder="70"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  kg
                </span>
              </div>
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    setErrors((prev) => ({ ...prev, height: "" }));
                  }}
                  placeholder="175"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    errors.height ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  cm
                </span>
              </div>
              {errors.height && (
                <p className="text-red-500 text-xs mt-1">{errors.height}</p>
              )}
            </div>
          </div>

          {/* Max Effort */}
          <div
            onClick={() => setMaxEffort((prev) => !prev)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              maxEffort
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                maxEffort ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`}
            >
              {maxEffort && (
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
                Maximum Effort
              </p>
              <p className="text-xs text-gray-500">
                Higher volume and intensity — best for those who want to push
                hard
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
