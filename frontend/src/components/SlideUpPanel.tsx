// components/SlideUpPanel.tsx
import { useState } from "react";
import { addMemo } from "../services/exerciseService"; // adjust path
import type { Exercise } from "../services/workoutService"; // adjust path

interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
  exerciseId: number;
  onMemoUpdated: (updatedExercise: Exercise) => void;
}

const SlideUpPanel = ({
  isOpen,
  onClose,
  content,
  exerciseId,
  onMemoUpdated,
}: SlideUpPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [memoInput, setMemoInput] = useState(content ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await addMemo(exerciseId, memoInput);
      if (response.success) {
        if (response.success && response.data) {
          onMemoUpdated(response.data);
          setIsEditing(false);
        }
        setIsEditing(false);
      }
    } catch (err) {
      setError("Failed to save memo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setError(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={handleClose} />}

      {/* Slide Up Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70%" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold text-lg">Memo</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-80px)] flex flex-col gap-4">
          {isEditing ? (
            <>
              <textarea
                className="w-full border rounded-lg p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={6}
                value={memoInput}
                onChange={(e) => setMemoInput(e.target.value)}
                placeholder="Write your memo here..."
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Memo"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setMemoInput(content ?? "");
                    setError(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700 whitespace-pre-wrap flex-1">
                {content ? (
                  content
                ) : (
                  <span className="text-gray-400 italic">
                    No memo yet. Add one below.
                  </span>
                )}
              </p>
              <button
                onClick={() => {
                  setMemoInput(content ?? "");
                  setIsEditing(true);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {content ? "Edit Memo" : "+ Add Memo"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SlideUpPanel;
