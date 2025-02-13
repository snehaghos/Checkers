import React, { useState } from 'react';

const boardSize = 8;

const Checker = () => {
    const [board, setBoard] = useState(initializeBoard());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);

    function initializeBoard() {
        const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if ((row < 3 || row > 4) && (row + col) % 2 === 1) {
                    newBoard[row][col] = row < 3 ? 'white' : 'black';
                }
            }
        }
        return newBoard;
    }

    const isValidMove = (fromRow, fromCol, toRow, toCol) => {
        if (board[toRow][toCol] !== null) return false;

        const piece = board[fromRow][fromCol];
        const direction = piece === "white" ? 1 : -1;

        return (
            (toRow - fromRow === direction && Math.abs(toCol - fromCol) === 1) || 
            (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) 
        );
    };

    const handleSquareClick = (row, col) => {
        if (selectedPiece) {
            if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
                movePiece(row, col);
            } else {
                setSelectedPiece(null);
                setPossibleMoves([]);
            }
        } else if (board[row][col]) {
            setSelectedPiece({ row, col });
            calculatePossibleMoves(row, col);
        }
    };

    const calculatePossibleMoves = (row, col) => {
        const moves = [];
        const directions = board[row][col] === 'white' ? [[1, 1], [1, -1]] : [[-1, 1], [-1, -1]];
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && isValidMove(row, col, newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            }
        });
        setPossibleMoves(moves);
    };

    const movePiece = (row, col) => {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
    };

    const renderPiece = (row, col) => {
        const piece = board[row][col];
        if (!piece) return null;

        const pieceColor = piece === 'white' ? 'bg-gray-300' : 'bg-black';
        return (
            <div
                className={`w-12 h-12 rounded-full ${pieceColor} mx-auto my-auto`}
            />
        );
    };

    const renderSquares = () => {
        return Array.from({ length: boardSize }, (_, row) => (
            <div key={row} className="flex">
                {Array.from({ length: boardSize }, (_, col) => {
                    const isDark = (row + col) % 2 === 1;
                    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
                    const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col);
                    return (
                        <div
                            key={col}
                            className={`w-16 h-16 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-300'} ${isSelected ? 'border-4 border-yellow-500' : ''} ${isPossibleMove ? 'animate-pulse bg-green-500' : ''}`}
                            onClick={() => handleSquareClick(row, col)}
                        >
                            {renderPiece(row, col)}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border-2 border-gray-700 rounded-sm">
                {renderSquares()}
            </div>
        </div>
    );
};

export default Checker;