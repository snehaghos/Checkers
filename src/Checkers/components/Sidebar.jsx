import React, { useState } from "react";
import "../cssFiles/Sidebar.css";
import ThemeModal from "../../Theme/ThemeModal";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onThemeChange, onHome, onInitialization, onSelectTheme }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="toggle-btn absolute w-[30px] h-[20px] right-[-40px] bg-gray-100/40" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </div>
            {isOpen && (
                <div className="sidebar-content">
                    <ul>
                        <li onClick={() => navigate("/")}>Home</li>
                        <li onClick={onInitialization}>Start Over</li>
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