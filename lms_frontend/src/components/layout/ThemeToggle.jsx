import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500 animate-fade-in" />
            ) : (
                <Moon className="w-5 h-5 text-indigo-600 animate-fade-in" />
            )}
        </button>
    );
};

export default ThemeToggle;
