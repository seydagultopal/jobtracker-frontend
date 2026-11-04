import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const THEME_KEY = 'app_theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return false;

  try {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
  } catch {
    // Fall back to the operating-system preference when storage is unavailable.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function applyTheme(isDarkMode) {
  const root = document.documentElement;
  root.classList.toggle('dark', isDarkMode);
  root.dataset.theme = isDarkMode ? 'dark' : 'light';
  root.style.colorScheme = isDarkMode ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(isDarkMode);

    try {
      window.localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    } catch {
      // Theme selection remains active for the current session.
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(current => !current);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
