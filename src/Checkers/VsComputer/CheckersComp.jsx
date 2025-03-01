import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Theme/ThemeProvider';
import whitePieceImage from '../../assets/images/whitepi.png';
import blackPieceImage from '../../assets/images/blackpi.png';
import yellowPieceImage from '../../assets/images/yellowpi.png';
import brownPieceImage from '../../assets/images/brownpi.png';
import '../cssFiles/Checkers.css';
import Board from '../components/Board';
import Sidebar from '../components/Sidebar';
import FinalGameOver from '../components/Modals/FinalGameOver';

const boardSize = 8;
const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

const initializeBoard = () => {
    const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if ((row < 3 || row > 4) && (row + col) % 2 === 1) {
                newBoard[row][col] = row < 3 ? 'white' : 'black';
            }
        }
    }
    return newBoard;
};

const CheckersComp = () => {
    const [board, setBoard] = useState(() => initializeBoard());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [turn, setTurn] = useState('black');

    const [possibleMoves, setPossibleMoves] = useState([]);
    const [scores, setScores] = useState({ white: 12, black: 12 });
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const { theme, changeTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState("black-white");

    const themeStyles = {
        "black-white": {
            darkCell: "bg-gray-700",
            lightCell: "bg-gray-300",
            whitePiece: whitePieceImage,
            blackPiece: blackPieceImage,
        },
        "brown-yellow": {
            darkCell: "bg-yellow-800",
            lightCell: "bg-yellow-300",
            whitePiece: yellowPieceImage,
            blackPiece: brownPieceImage,
        },
    };
    const currentTheme = themeStyles[selectedTheme];

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    };

    const calculatePossibleMoves = (row, col) => {
        const piece = board[row][col];
        if (!piece) return [];

        const isKing = piece.includes("King");
        const pieceColor = piece.split('-')[0];
        const pieceDirections = isKing ? directions : pieceColor === 'white' ? [[1, 1], [1, -1]] : [[-1, 1], [-1, -1]];
        const moves = [];

        pieceDirections.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === null) {
                moves.push({ row: newRow, col: newCol });
            }
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                const midPiece = board[newRow][newCol];
                if (midPiece && !midPiece.startsWith(pieceColor)) {
                    const jumpRow = newRow + dRow;
                    const jumpCol = newCol + dCol;
                    if (jumpRow >= 0 && jumpRow < boardSize && jumpCol >= 0 && jumpCol < boardSize && board[jumpRow][jumpCol] === null) {
                        moves.push({ row: jumpRow, col: jumpCol });
                    }
                }
            }
        });
        return moves;
    };

    const movePiece = (fromRow, fromCol, toRow, toCol) => {
        const newBoard = board.map(row => row.slice());
        const piece = newBoard[fromRow][fromCol];
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        if (Math.abs(toRow - fromRow) === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            newBoard[midRow][midCol] = null;
            setScores(prev => ({
                ...prev,
                [piece.startsWith('white') ? 'black' : 'white']: prev[piece.startsWith('white') ? 'black' : 'white'] - 1
            }));
        }

        const pieceColor = piece.split('-')[0];
        if ((toRow === 0 && pieceColor === 'black') || (toRow === boardSize - 1 && pieceColor === 'white')) {
            newBoard[toRow][toCol] = `${pieceColor}-King`;
        }

        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        const nextTurn = turn === 'white' ? 'black' : 'white';
        setTurn(nextTurn);

        checkGameOver(newBoard, nextTurn);
    };

    const checkGameOver = (newBoard, nextTurn) => {
        const whitePieces = newBoard.flat().filter(piece => piece && piece.startsWith('white')).length;
        const blackPieces = newBoard.flat().filter(piece => piece && piece.startsWith('black')).length;

        if (whitePieces === 0) {
            setIsGameOver(true);
            setIsWin(false);
        } else if (blackPieces === 0) {
            setIsGameOver(true);
            setIsWin(true);
        } else {
            const hasMoves = checkPlayerHasMoves(newBoard, nextTurn);
            if (!hasMoves) {
                setIsGameOver(true);
                setIsWin(nextTurn === 'black'); 
            }
        }
    };

    const checkPlayerHasMoves = (board, player) => {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const piece = board[row][col];
                if (piece && piece.startsWith(player)) {
                    const moves = calculatePossibleMoves(row, col);
                    if (moves.length > 0) return true;
                }
            }
        }
        return false; // No moves left for this player
    };
    

    const resetGame = () => {
        setIsGameOver(false);
        setBoard(initializeBoard());
        setScores({ white: 12, black: 12 });
        setTurn('black'); // User starts
    };
    
    const aiMove = () => {
        if (turn !== 'white') return; // AI should play as white
    
        let bestMove = null;
        let bestScore = -Infinity;
    
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell && cell.startsWith('white')) { // AI should move white pieces
                    const moves = calculatePossibleMoves(rowIndex, colIndex);
                    moves.forEach(({ row: newRow, col: newCol }) => {
                        const tempBoard = board.map(r => r.slice());
                        tempBoard[newRow][newCol] = cell;
                        tempBoard[rowIndex][colIndex] = null;
                        let moveScore = (Math.abs(newRow - rowIndex) === 2) ? 10 : 1; // Prioritize jumps
                        
                        if (moveScore > bestScore) {
                            bestScore = moveScore;
                            bestMove = { fromRow: rowIndex, fromCol: colIndex, toRow: newRow, toCol: newCol };
                        }
                    });
                }
            });
        });
    
        if (bestMove) {
            movePiece(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
        }
    };
    

    useEffect(() => {
        if (turn === 'white') {
            setTimeout(aiMove, 1000);
        }
    }, [turn, board]);
    

    return (
        <div className={`flex flex-col items-center h-screen bg-gray-900 text-white`}>
            <Sidebar onThemeChange={() => { }} onSelectTheme={handleThemeSelect} />
            <h1 className="text-3xl font-bold my-4">
    Checkers - {turn === 'black' ? "User's Turn" : "Computer's Turn"}
</h1>
            <h2 className="text-lg mb-2">White: {scores.white} | Black: {scores.black}</h2>
            <Board
                board={board}
                selectedPiece={selectedPiece}
                possibleMoves={possibleMoves}
                handleSquareClick={(row, col) => {
                    if (isGameOver) return;
                    if (selectedPiece) {
                        if (selectedPiece.row === row && selectedPiece.col === col) {
                            setSelectedPiece(null);
                            setPossibleMoves([]);
                        } else if (possibleMoves.some(move => move.row === row && move.col === col)) {
                            movePiece(selectedPiece.row, selectedPiece.col, row, col);
                        } else {
                            setSelectedPiece(null);
                            setPossibleMoves([]);
                        }
                    } else if (board[row][col] && board[row][col].startsWith(turn)) {
                        setSelectedPiece({ row, col });
                        setPossibleMoves(calculatePossibleMoves(row, col));
                    }
                }}
                currentTheme={currentTheme}
            />
            <FinalGameOver isOpen={isGameOver} isWin={isWin} onClose={resetGame} />
        </div>
    );
};

export default CheckersComp;