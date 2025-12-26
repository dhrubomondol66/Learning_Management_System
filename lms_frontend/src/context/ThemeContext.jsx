import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './authContext';
import api from '../services/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user, updateUser } = useAuth();

    // Initialize from localStorage immediately for fast load
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Handle class application and localStorage persistence
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Sync from user profile only on login or when user theme changes (external to this hook)
    useEffect(() => {
        if (user?.theme) {
            const userPrefersDark = user.theme === 'dark';
            // Only update if current state differs from user preference
            if (userPrefersDark !== isDarkMode) {
                setIsDarkMode(userPrefersDark);
            }
        }
    }, [user?.id, user?.theme]);

    const toggleTheme = useCallback(async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (user) {
            try {
                const updatedUser = {
                    ...user,
                    theme: newMode ? 'dark' : 'light'
                };

                await api.put('/auth/profile/', updatedUser);
                updateUser(updatedUser);
            } catch (error) {
                console.error('Failed to sync theme to server:', error);
            }
        }
    }, [isDarkMode, user, updateUser]);

    const setTheme = useCallback(async (theme) => {
        const isDark = theme === 'dark';
        setIsDarkMode(isDark);

        if (user && user.theme !== theme) {
            try {
                const updatedUser = {
                    ...user,
                    theme: theme
                };
                await api.put('/auth/profile/', updatedUser);
                updateUser(updatedUser);
            } catch (error) {
                console.error('Failed to sync theme selection to server:', error);
            }
        }
    }, [user, updateUser]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
