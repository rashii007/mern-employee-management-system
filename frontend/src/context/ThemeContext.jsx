import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  if (typeof window === "undefined") return false;

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") return true;

  if (savedTheme === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
