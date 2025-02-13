import React, { useState } from "react";
import "./Sidebar.css";
import ThemeModal from "../../../Theme/ThemeModal";



const Sidebar = ({ onThemeChange, onHome, onStartOver, onSelectTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="toggle-btn absolute w-[30px] h-[20px] right-[-40px] bg-gray-100/40" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </div>
            {isOpen && (
                <div className="sidebar-content">
                    <ul>
                        <li onClick={onHome}>Home</li>
                        <li onClick={onStartOver}>Start Over</li>
                        <li onClick={() => setIsThemeModalOpen(true)}>Theme</li>
                    </ul>
                </div>
            )}

         
            <ThemeModal
                isOpen={isThemeModalOpen}
                onClose={() => setIsThemeModalOpen(false)}
                onSelectTheme={onSelectTheme}
            />
        </div>
    );
};

export default Sidebar;
