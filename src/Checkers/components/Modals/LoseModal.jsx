import React from 'react';

const LoseModal = ({ isOpen, winner, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Game Over</h2>
                <p className="text-lg mb-4">{winner} wins!</p>
                <button onClick={onClose} className="bg-blue-500 text-white py-2 px-4 rounded">Close</button>
            </div>
        </div>
    );
};

export default LoseModal;