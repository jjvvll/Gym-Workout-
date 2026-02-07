import React from "react";

type LoadingPopupProps = {
  isOpen: boolean;
  message?: string; // optional custom message
};

const LoadingPopup: React.FC<LoadingPopupProps> = ({ isOpen, message }) => {
  if (!isOpen) return null; // don’t render if closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 shadow-lg">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-700 font-medium">{message || "Loading..."}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
