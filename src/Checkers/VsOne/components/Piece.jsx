import React from 'react';
import { motion } from 'framer-motion';

const Piece = ({ piece, currentTheme }) => {
    if (!piece) return null;

    const pieceImage = piece.includes("white") ? currentTheme.whitePiece : currentTheme.blackPiece;
    const isKing = piece.includes('King');
    const neonBorder = isKing ? 'neon-border' : '';

    return (
        <motion.div
            className={`w-12 h-12 rounded-full mx-auto my-auto ${neonBorder} md:w-16 md:h-16 sm:w-10 sm:h-10`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <img src={pieceImage} alt={`${piece} piece`} className="w-full h-full rounded-full" />
        </motion.div>
    );
};

export default Piece;