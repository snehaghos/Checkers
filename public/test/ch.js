import React, { useState } from "react";
import { motion } from "framer-motion";
import whitePieceImage from "../assets/images/whitepi.png";
import blackPieceImage from "../assets/images/blackpi.png";
import brownPieceImage from "../assets/images/brownpi.png";
import yellowPieceImage from "../assets/images/yellowpi.png";
import Sidebar from "./components/Sidebar";
import { useTheme } from "../Theme/ThemeProvider";

const boardSize = 8;

const Checker = () => {
    const [board, setBoard] = useState(initializeBoard());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [turn, setTurn] = useState("white");
    const [scores, setScores] = useState({ white: 0, black: 0 });
    const { theme } = useTheme();

    // Theme selection state
    const [selectedTheme, setSelectedTheme] = useState("black-white");

    // Board and piece colors based on selected theme
    const themeStyles = {
        "black-white": {
            darkCell: "bg-gray-700",
            lightCell: "bg-gray-300",
            whitePiece: whitePieceImage,
            blackPiece: blackPieceImage,
        },
        "brown-yellow": {
            darkCell: "bg-yellow-700",
            lightCell: "bg-yellow-300",
            whitePiece: yellowPieceImage,
            blackPiece: brownPieceImage,
        },
    };

    const currentTheme = themeStyles[selectedTheme];

    function initializeBoard() {
        const newBoard = Array(boardSize)
            .fill(null)
            .map(() => Array(boardSize).fill(null));
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if ((row < 3 || row > 4) && (row + col) % 2 === 1) {
                    newBoard[row][col] = row < 3 ? "white" : "black";
                }
            }
        }
        return newBoard;
    }

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    };

    const renderPiece = (row, col) => {
        const piece = board[row][col];
        if (!piece) return null;

        const pieceImage = piece.includes("white") ? currentTheme.whitePiece : currentTheme.blackPiece;

        return (
            <motion.div
                className="w-12 h-12 rounded-full mx-auto my-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <img src={pieceImage} alt={`${piece} piece`} className="w-full h-full rounded-full" />
            </motion.div>
        );
    };

    return (
        <div className={`flex flex-col items-center h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <Sidebar onThemeChange={() => {}} onSelectTheme={handleThemeSelect} />
            <h1 className="text-3xl font-bold my-4">Checkers - {turn.toUpperCase()}'s Turn</h1>
            <h2 className="text-lg mb-2">White: {scores.white} | Black: {scores.black}</h2>
            <div className="border-4 border-gray-700 rounded-lg p-2">
                {Array.from({ length: boardSize }, (_, row) => (
                    <div key={row} className="flex">
                        {Array.from({ length: boardSize }, (_, col) => {
                            const isDark = (row + col) % 2 === 1;
                            return (
                                <motion.div
                                    key={col}
                                    className={`w-16 h-16 flex items-center justify-center ${isDark ? currentTheme.darkCell : currentTheme.lightCell}`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {renderPiece(row, col)}
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Checker;
