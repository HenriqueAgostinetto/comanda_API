import { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.body.className = mode === 'dark' ? 'theme-dark' : 'theme-light';
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,                                                                                                                         // hernique agostinetto piva
      ...(mode === 'dark'
        ? {
            primary: { main: '#b20000' },
            background: { default: '#0a0a0a', paper: '#1a1a1a' },
            text: { primary: '#ffffff', secondary: '#b3b3b3' },
          }
        : {
            primary: { main: '#d32f2f' },
            background: { default: '#f1f5f9', paper: '#ffffff' },
            text: { primary: '#0f172a', secondary: '#475569' },
          }),
    },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}