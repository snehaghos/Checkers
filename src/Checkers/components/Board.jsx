import React from 'react';
import Square from './Square';

const Board = ({ board, selectedPiece, possibleMoves, handleSquareClick, currentTheme }) => {
    const boardSize = 8;

    return (
        <div className="border-4 border-gray-700 rounded-lg p-2">
            {Array.from({ length: boardSize }, (_, row) => (
                <div key={row} className="flex">
                    {Array.from({ length: boardSize }, (_, col) => {
                        const isDark = (row + col) % 2 === 1;
                        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
                        const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col);
                        return (
                            <Square
                                key={col}
                                row={row}
                                col={col}
                                isDark={isDark}
                                isSelected={isSelected}
                                isPossibleMove={isPossibleMove}
                                handleSquareClick={handleSquareClick}
                                currentTheme={currentTheme}
                                piece={board[row][col]}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Board;