import { useState, useEffect } from "react";

interface TimerPopupProps {
  restTime: number;
  onClose: () => void;
}

const TimerPopup = ({ restTime, onClose }: TimerPopupProps) => {
  const [timeLeft, setTimeLeft] = useState(restTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-center mb-6">Rest Timer</h3>

        <div className="text-6xl font-bold text-center text-blue-600 mb-6">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / restTime) * 100}%` }}
          ></div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Skip Rest
        </button>
      </div>
    </div>
  );
};

export default TimerPopup;
