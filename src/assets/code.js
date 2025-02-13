import React, { useState } from "react";

const boardSize = 8;

const Code = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);

  function initializeBoard() {
    const newBoard = Array.from({ length: boardSize }, () =>
      Array(boardSize).fill(null)
    );
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if ((row < 3 || row > 4) && (row + col) % 2 === 1) {
          newBoard[row][col] = row < 3 ? "white" : "black";
        }
      }
    }
    return newBoard;
  }

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    if (board[toRow][toCol] !== null) return false; // Must land on an empty square

    const piece = board[fromRow][fromCol];
    const direction = piece === "white" ? 1 : -1;

    return (
      (toRow - fromRow === direction && Math.abs(toCol - fromCol) === 1) || // Regular move
      (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) // Placeholder for jumps
    );
  };

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        movePiece(row, col);
      } else {
        setSelectedPiece(null); // Invalid move, deselect
      }
    } else if (board[row][col]) {
      setSelectedPiece({ row, col });
    }
  };

  const movePiece = (row, col) => {
    const newBoard = structuredClone(board); // Deep copy
    newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
    newBoard[selectedPiece.row][selectedPiece.col] = null;
    setBoard(newBoard);
    setSelectedPiece(null);
  };

  const renderPiece = (row, col) => {
    const piece = board[row][col];
    if (!piece) return null;

    const pieceColor = piece === "white" ? "bg-gray-300" : "bg-black";
    return <div className={`w-12 h-12 rounded-full ${pieceColor} mx-auto my-auto`} />;
  };

  const renderSquares = () => {
    return Array.from({ length: boardSize }, (_, row) => (
      <div key={row} className="flex">
        {Array.from({ length: boardSize }, (_, col) => {
          const isDark = (row + col) % 2 === 1;
          const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
          return (
            <div
              key={col}
              className={`w-16 h-16 flex items-center justify-center ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              } ${isSelected ? "border-4 border-yellow-500" : ""}`}
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
      <div className="border-2 border-gray-700 rounded-sm">{renderSquares()}</div>
    </div>
  );
};

export default Code;