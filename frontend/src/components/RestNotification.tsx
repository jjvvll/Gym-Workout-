import { useEffect, useRef } from "react";

interface RestNotificationProps {
  isVisible: boolean;
  onStop: () => void;
}

const RestNotification = ({ isVisible, onStop }: RestNotificationProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Play alarm when notification appears
      audioRef.current = new Audio("/sounds/notification-sound.mp3");
      audioRef.current.loop = true; // keep playing until stopped
      audioRef.current.play().catch((err) => console.log("Audio failed:", err));
    } else {
      // Stop and reset audio when notification hides
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isVisible]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out overflow-hidden ${
        isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
      style={{ height: "25vh" }}
    >
      {/* Inner div holds the shadow so it gets clipped when sliding out */}
      <div className="h-full bg-white border-b-4 border-blue-500 shadow-2xl flex flex-col items-center justify-center gap-4 px-6">
        {/* Pulsing icon */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Time's Up!
          </h2>
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
          </span>
        </div>

        <p className="text-sm text-gray-500">Your rest period is over.</p>

        <button
          onClick={onStop}
          className="px-8 py-2.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-full transition-colors shadow-md"
        >
          ■ Stop
        </button>
      </div>
    </div>
  );
};

export default RestNotification;
