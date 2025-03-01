import React from 'react';

const FinalGameOver = ({ isOpen, isWin, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center text-amber-300">
                <h2 className="text-2xl font-bold mb-4">
                    {isWin ? "Computer Won!" : "You Won!"}
                </h2>
                <p className="mb-4">
                    {isWin ? "Better luck next time!" : "Congratulations! You defeated the computer."}
                </p>
                <button
                    onClick={onClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default FinalGameOver;