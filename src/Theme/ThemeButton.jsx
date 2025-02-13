import React from 'react';
import { useTheme } from './ThemeProvider';



const ThemeButton = () => {
    const { changeTheme } = useTheme();

    const handleThemeChange = () => {
        const themes = ['bg', 'bg2', 'bg3','bg4']; 
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        changeTheme(randomTheme);
    };

    return (
        <button onClick={handleThemeChange} >
             Theme
        </button>
    );
};

export default ThemeButton;
