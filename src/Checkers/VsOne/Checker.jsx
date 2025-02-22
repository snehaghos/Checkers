
import React, { useState } from 'react';
import { useTheme } from '../../Theme/ThemeProvider';
import whitePieceImage from '../../assets/images/whitepi.png';
import blackPieceImage from '../../assets/images/blackpi.png';
import yellowPieceImage from '../../assets/images/yellowpi.png';
import brownPieceImage from '../../assets/images/brownpi.png';
import '../cssFiles/Checkers.css';
import Board from '../components/Board';
import Sidebar from '../components/Sidebar';
import LoseModal from '../components/Modals/LoseModal';

const boardSize = 8;
const Checker = () => {
    const [board, setBoard] = useState(() => initializeBoard());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [turn, setTurn] = useState('white');
    const [scores, setScores] = useState({ white: 12, black: 12 });
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const { theme, changeTheme } = useTheme(); 
    const [selectedTheme, setSelectedTheme] = useState("black-white");

    const themeStyles = {
        "black-white": {
            darkCell: "bg-gray-700",
            lightCell: "bg-gray-300",
            whitePiece: whitePieceImage,
            blackPiece: blackPieceImage,
            backgroundColor: "bg-gray-900",
        },
        "brown-yellow": {
            darkCell: "bg-yellow-800",
            lightCell: "bg-yellow-300",
            whitePiece: yellowPieceImage,
            blackPiece: brownPieceImage,
            backgroundColor: "bg-red-900",
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

    const handleInitializeBoard = () => {
        setBoard(initializeBoard());
        setIsGameOver(false);
        setWinner(null);
        setTurn('white');
        setScores({ white: 12, black: 12 });
    }

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
            const midPiece = board[midRow][midCol];
            if (midPiece && midPiece !== piece && !midPiece.includes(turn)) {
                return true;
            }
        }
        return false;
    };

    const handleSquareClick = (row, col) => {
        if (selectedPiece) {
            if (possibleMoves.some(move => move.row === row && move.col === col)) {
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
            // Check for jumps
            const jumpRow = row + 2 * dRow;
            const jumpCol = col + 2 * dCol;
            if (jumpRow >= 0 && jumpRow < boardSize && jumpCol >= 0 && jumpCol < boardSize) {
                const midRow = (row + jumpRow) / 2;
                const midCol = (col + jumpCol) / 2;
                const midPiece = board[midRow][midCol];
                if (midPiece && midPiece !== piece && !midPiece.includes(turn) && board[jumpRow][jumpCol] === null) {
                    moves.push({ row: jumpRow, col: jumpCol });
                }
            }
        });
    
        setPossibleMoves(moves);
    };

    const getPossibleCaptures = (board, row, col) => {
        const moves = [];
        const piece = board[row][col];
        if (!piece) return moves;

        const color = piece.replace('-King', '');
        const isKing = piece.includes('King');
        const directions = isKing 
            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] 
            : color === 'white' 
            ? [[1, 1], [1, -1]] 
            : [[-1, 1], [-1, -1]];

        for (const [dr, dc] of directions) {
            const enemyRow = row + dr;
            const enemyCol = col + dc;
            const jumpRow = row + 2 * dr;
            const jumpCol = col + 2 * dc;

            if (jumpRow < 0 || jumpRow >= boardSize || jumpCol < 0 || jumpCol >= boardSize) continue;

            const enemyPiece = board[enemyRow][enemyCol];
            if (!enemyPiece || enemyPiece.replace('-King', '') === color) continue;

            if (board[jumpRow][jumpCol] === null) {
                moves.push({ row: jumpRow, col: jumpCol });
            }
        }

        return moves;
    };

    const checkGameOver = (newBoard) => {
        const whitePieces = newBoard.flat().filter(piece => piece && piece.includes('white')).length;
        const blackPieces = newBoard.flat().filter(piece => piece && piece.includes('black')).length;

        if (whitePieces === 0) {
            setWinner('Black');
            setIsGameOver(true);
        } else if (blackPieces === 0) {
            setWinner('White');
            setIsGameOver(true);
        }
    };

    const movePiece = (toRow, toCol) => {
        const newBoard = board.map(row => row.slice());
        const fromRow = selectedPiece.row;
        const fromCol = selectedPiece.col;
        const piece = newBoard[fromRow][fromCol];
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        let captured = false;

        if (Math.abs(toRow - fromRow) === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            newBoard[midRow][midCol] = null;
            setScores(prev => ({
                ...prev,
                [turn === 'white' ? 'black' : 'white']: prev[turn === 'white' ? 'black' : 'white'] - 1
            }));
            captured = true;
        }

        if ((toRow === 0 && piece === 'black') || (toRow === boardSize - 1 && piece === 'white')) {
            newBoard[toRow][toCol] = piece + '-King';
        }

        setBoard(newBoard);

        if (captured) {
            const captures = getPossibleCaptures(newBoard, toRow, toCol);
            if (captures.length > 0) {
                setSelectedPiece({ row: toRow, col: toCol });
                setPossibleMoves(captures);
            } else {
                setTurn(turn === 'white' ? 'black' : 'white');
                setSelectedPiece(null);
                setPossibleMoves([]);
                checkGameOver(newBoard);
            }
        } else {
            setTurn(turn === 'white' ? 'black' : 'white');
            setSelectedPiece(null);
            setPossibleMoves([]);
            checkGameOver(newBoard);
        }
    };

    return (
        <div className={`flex flex-col items-center h-screen ${currentTheme.backgroundColor} text-white`}>
            <Sidebar onThemeChange={() => { }} onSelectTheme={handleThemeSelect} onInitialization={handleInitializeBoard}/>
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
            <LoseModal isOpen={isGameOver} winner={winner} onClose={() => setIsGameOver(false)} />
        </div>
    );
};

export default Checker;