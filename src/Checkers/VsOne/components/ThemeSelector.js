import React from "react";
import { useTheme } from "../Theme/ThemeProvider";

const ThemeSelector = () => {
  const { theme, changeTheme } = useTheme();

  return (
    <div>
      <h1 className="text-2xl font-luckiestGuy text-slate-100">
        {theme}
      </h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeSelector;

