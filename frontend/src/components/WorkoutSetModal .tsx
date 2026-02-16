import { useState } from "react";
import { storeWorkoutSet, updateWorkoutSet } from "../services/workoutService";
import type {
  StoreWorkoutSetPayload,
  ApiResponse,
  WorkoutSet,
} from "../services/workoutService";
import { useEffect } from "react";

type WorkoutSetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (workoutSet: WorkoutSet) => void;
  setWorkoutToEdit: (workout?: WorkoutSet) => void;
  workoutToEdit?: WorkoutSet;
};

export const WorkoutSetModal = ({
  isOpen,
  onClose,
  onCreated,
  workoutToEdit,
  setWorkoutToEdit,
}: WorkoutSetModalProps) => {
  // form state
  const [name, setName] = useState(workoutToEdit?.name || "");
  const [description, setDescription] = useState(
    workoutToEdit?.description || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonText = workoutToEdit?.id
    ? loading
      ? "Updating..."
      : "Update"
    : loading
      ? "Creating..."
      : "Create";

  const clearForm = () => {
    setName("");
    setDescription("");
    setLoading(false);
    setError(null);
  };

  const handleClose = () => {
    clearForm(); // reset state
    setWorkoutToEdit?.(undefined);
    onClose(); // notify parent to close modal
  };

  useEffect(() => {
    if (isOpen) {
      setName(workoutToEdit?.name || "");
      setDescription(workoutToEdit?.description || "");
      setError(null);
      setLoading(false);
    }
  }, [isOpen, workoutToEdit]);

  if (!isOpen) return null; // modal closed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: StoreWorkoutSetPayload = { name, description };

    try {
      let response: ApiResponse<WorkoutSet>;

      if (workoutToEdit) {
        // EDIT mode: call update API
        response = await updateWorkoutSet(workoutToEdit.id, payload);
      } else {
        // CREATE mode: call store API
        response = await storeWorkoutSet(payload);
      }

      if (response.success) {
        onCreated?.(response.data!); // notify parent
        onClose();
      } else {
        setError(response.message || "Operation failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Workout Set</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};
