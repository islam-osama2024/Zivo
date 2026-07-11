import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        // لو المستخدم عنده اختيار محفوظ قبل كده، استخدمه
        const saved = localStorage.getItem("theme");
        if (saved) return saved === "dark";
        // لو مفيش، اتبع إعداد النظام (OS)
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        // ده اللي بيحط/يشيل كلاس "dark" على <html> — بيأثر على الصفحة كلها
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);