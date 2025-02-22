import React from 'react';

const FinalGameOver = ({ isOpen, onClose, type }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {type === 'gameOver' ? (
                    <>
                        <div className="font-luckiestGuy text-red-500 text-5xl">Game Over</div>
                        <br />
                        <button  className="p-4 text-3xl rounded-md text-violet-700">
                            New Game
                        </button>
                    </>
                ) : (
                    <>
                        <div className="font-luckiestGuy text-red-500 text-5xl">Game Over</div>
                        <br />
                      
                    </>
                )}
            </div>
        </div>
    );
};

export default FinalGameOver;
