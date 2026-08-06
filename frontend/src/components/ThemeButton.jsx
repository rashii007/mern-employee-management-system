import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeButton = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 flex cursor-pointer items-center justify-center rounded-full bg-black text-black hover:bg-gray-600/90 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:border-slate-600/50"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5  text-white" />
      )}
    </button>
  );
};

export default ThemeButton;