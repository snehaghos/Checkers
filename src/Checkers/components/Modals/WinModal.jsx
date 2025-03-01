import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const WinModal = ({ isOpen, winner, onClose }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Confetti effect */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={300}
        recycle={false}
      />

      {/* Modal overlay */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-2xl shadow-2xl text-center transform transition-all duration-500 hover:scale-105">
          {/* Animated title */}
          <h1 className="text-6xl font-bold text-yellow-400 animate-bounce">
            {winner} Wins! 🎉
          </h1>
          {/* Subtitle */}
          <p className="text-2xl mt-4 text-white">
            {winner === 'White' ? "Congratulations! White player wins." : "Congratulations! Black player wins."}
          </p>
          {/* Play Again button */}
          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    </>
  );
};

export default WinModal;