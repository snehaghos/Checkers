import React from 'react';
import { motion } from 'framer-motion';
import Piece from './Piece';

const Square = ({ row, col, isDark, isSelected, isPossibleMove, handleSquareClick, currentTheme, piece }) => {
    return (
        <motion.div
            className={`w-12 h-12 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center ${isDark ? currentTheme.darkCell : currentTheme.lightCell}
                ${isSelected ? "border-4 border-red-500" : ""} 
                ${isPossibleMove ? "bg-green-500 opacity-50" : ""}`}
            whileHover={{ scale: 1.01 }}
            onClick={() => handleSquareClick(row, col)}
        >
            <Piece piece={piece} currentTheme={currentTheme} />
        </motion.div>
    );
};

export default Square;