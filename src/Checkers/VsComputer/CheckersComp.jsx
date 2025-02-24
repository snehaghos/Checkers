import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Theme/ThemeProvider';
import whitePieceImage from '../../assets/images/whitepi.png';
import blackPieceImage from '../../assets/images/blackpi.png';
import yellowPieceImage from '../../assets/images/yellowpi.png';
import brownPieceImage from '../../assets/images/brownpi.png';
import '../cssFiles/Checkers.css';
import Board from '../components/Board';
import Sidebar from '../components/Sidebar';

import LoseModal from '../components/Modals/LoseModal';
import WinModal from '../components/Modals/winModal';

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
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [turn, setTurn] = useState('white');
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
        const pieceDirections = isKing ? directions : piece.includes('white') ? [[1, 1], [1, -1]] : [[-1, 1], [-1, -1]];
        const moves = [];

        pieceDirections.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === null) {
                moves.push({ row: newRow, col: newCol });
            }
            if (newRow + dRow >= 0 && newRow + dRow < boardSize && newCol + dCol >= 0 && newCol + dCol < boardSize) {
                if (board[newRow][newCol] && !board[newRow][newCol].includes(piece)) {
                    if (board[newRow + dRow][newCol + dCol] === null) {
                        moves.push({ row: newRow + dRow, col: newCol + dCol });
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
                [turn === 'white' ? 'black' : 'white']: prev[turn === 'white' ? 'black' : 'white'] - 1
            }));
        }

        if ((toRow === 0 && piece === 'black') || (toRow === boardSize - 1 && piece === 'white')) {
            newBoard[toRow][toCol] = piece + '-King';
        }

        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setTurn(turn === 'white' ? 'black' : 'white');

        checkGameOver(newBoard);
    };



    const checkGameOver = (newBoard) => {
        const whitePieces = newBoard.flat().filter(piece => piece && piece.includes('white')).length;
        const blackPieces = newBoard.flat().filter(piece => piece && piece.includes('black')).length;
    
        // Ensure game-over check only runs after a move
        if (whitePieces === 12 && blackPieces === 12) return; 
    
        if (whitePieces === 0) {
            setIsGameOver(true);
            setIsWin(false);
        } else if (blackPieces === 0) {
            setIsGameOver(true);
            setIsWin(true);
        }
    };
    
    const resetGame = () => {
        setIsGameOver(false); 
        setBoard(initializeBoard()); 
        setScores({ white: 12, black: 12 }); 
        setTurn('white');
    };
    

    const aiMove = () => {
        if (turn !== 'black') return;
        let bestMove = null;
        let bestScore = -Infinity;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell && cell.includes('black')) {
                    const moves = calculatePossibleMoves(rowIndex, colIndex);
                    moves.forEach(({ row: newRow, col: newCol }) => {
                        const tempBoard = board.map(r => r.slice());
                        tempBoard[newRow][newCol] = cell;
                        tempBoard[rowIndex][colIndex] = null;
                        let moveScore = (Math.abs(newRow - rowIndex) === 2) ? 10 : 1;
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
        if (turn === 'black') {
            setTimeout(aiMove, 1000);
        }
    }, [turn, board]);

    return (
        <div className={`flex flex-col items-center h-screen bg-gray-900 text-white`}>
            <Sidebar onThemeChange={() => { }} onSelectTheme={handleThemeSelect} />
            <h1 className="text-3xl font-bold my-4">Checkers - {turn.toUpperCase()}'s Turn</h1>
            <h2 className="text-lg mb-2">White: {scores.white} | Black: {scores.black}</h2>
            <Board
                board={board}
                selectedPiece={selectedPiece}
                possibleMoves={possibleMoves}
                handleSquareClick={(row, col) => {
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
                    } else if (board[row][col] && board[row][col].includes(turn)) {
                        setSelectedPiece({ row, col });
                        setPossibleMoves(calculatePossibleMoves(row, col));
                    }
                }}
                currentTheme={currentTheme}
            />
{isGameOver && isWin && <WinModal onClose={resetGame} />}
{isGameOver && !isWin && <LoseModal onClose={resetGame} />}
        </div>
    );
};

export default CheckersComp;