import React, { useState } from 'react';
import { useTheme } from '../../Theme/ThemeProvider';
import whitePieceImage from '../../assets/images/whitepi.png';
import blackPieceImage from '../../assets/images/blackpi.png';
import yellowPieceImage from '../../assets/images/yellowpi.png';
import brownPieceImage from '../../assets/images/brownpi.png';
import '../cssFiles/Checkers.css';
import Board from '../components/Board';
import Sidebar from '../components/Sidebar';

const boardSize = 8;
const Checker = () => {
    const [board, setBoard] = useState(() => initializeBoard());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [turn, setTurn] = useState('white');
    const [scores, setScores] = useState({ white: 0, black: 0 });
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

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    };

    const isValidMove = (fromRow, fromCol, toRow, toCol) => {
        if (board[toRow][toCol] !== null) return false;

        const piece = board[fromRow][fromCol];
        if (!piece || (piece !== turn && !piece.includes('King'))) return false;

        const direction = piece.includes('white') ? 1 : -1;
        const isKing = piece.includes('King');

        if (Math.abs(toCol - fromCol) === 1 && (toRow - fromRow === direction || (isKing && Math.abs(toRow - fromRow) === 1))) {
            return true;
        }

        if (Math.abs(toCol - fromCol) === 2 && Math.abs(toRow - fromRow) === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            if (board[midRow][midCol] && board[midRow][midCol] !== piece) {
                return true;
            }
        }
        return false;
    };

    const handleSquareClick = (row, col) => {
        if (selectedPiece) {
            if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
                movePiece(row, col);
            } else {
                setSelectedPiece(null);
                setPossibleMoves([]);
            }
        } else if (board[row][col] && board[row][col].includes(turn)) {
            setSelectedPiece({ row, col });
            calPossibleMove(row, col);
        }
    };

    const calPossibleMove = (row, col) => {
        const moves = [];
        const piece = board[row][col];
        const isKing = piece.includes("King");
    
        const directions = isKing
            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            : piece.includes('white')
            ? [[1, 1], [1, -1]]
            : [[-1, 1], [-1, -1]];
    
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
        const piece = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[row][col] = piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;

        if (Math.abs(row - selectedPiece.row) === 2) {
            const midRow = (row + selectedPiece.row) / 2;
            const midCol = (col + selectedPiece.col) / 2;
            newBoard[midRow][midCol] = null;
            setScores(prev => ({ ...prev, [turn]: prev[turn] + 1 }));
        }

        if ((row === 0 && piece === 'black') || (row === boardSize - 1 && piece === 'white')) {
            newBoard[row][col] = piece + '-King';
            setScores(prev => ({ ...prev, [turn]: prev[turn] + 3 }));
        }

        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setTurn(turn === 'white' ? 'black' : 'white');
    };

    return (
        <div className={`flex flex-col items-center h-screen bg-gray-900 text-white`}>
            <Sidebar onThemeChange={() => { }} onSelectTheme={handleThemeSelect} />
            <h1 className="text-3xl font-bold my-4 md:text-2xl sm:text-xl xs:text-lg">Checkers - {turn.toUpperCase()}'s Turn</h1>
            <h2 className="text-lg mb-2 md:text-base sm:text-sm xs:text-xs">White: {scores.white} | Black: {scores.black}</h2>
            <div className="w-full flex justify-center">
                <Board
                    board={board}
                    selectedPiece={selectedPiece}
                    possibleMoves={possibleMoves}
                    handleSquareClick={handleSquareClick}
                    currentTheme={currentTheme}
                />
            </div>
            <div>
                <button onClick={() => setBoard(initializeBoard())} className="bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-md">Reset</button>
            </div>
        </div>
    );
};

export default Checker;