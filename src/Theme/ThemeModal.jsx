import React from "react";

const ThemeModal = ({ isOpen, onClose, onSelectTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Choose a Theme</h2>
        <div className="flex justify-around">
          <button
            className="p-4 bg-yellow-700 text-white rounded"
            onClick={() => onSelectTheme("brown-yellow")}
          >
            Brown-Yellow Theme
          </button>
          <button
            className="p-4 bg-gray-800 text-white rounded"
            onClick={() => onSelectTheme("black-white")}
          >
            Black-White Theme
          </button>
        </div>
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ThemeModal;
