import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider as MuiProvider } from '@mui/material/styles';

/**
 * Theme (light/dark).
 *
 * Only design TOKENS change (see the `[data-theme='dark']` block in index.css),
 * so every styled-component and UI-kit component follows automatically.
 *
 * Three colour systems are kept in sync from here:
 *  1. our CSS tokens        -> `data-theme`    on <html>
 *  2. Bootstrap 5.3 (CDN)   -> `data-bs-theme` on <html>  (native colour modes)
 *  3. MUI (date/time pickers) -> <MuiThemeBridge>
 *
 * The initial value is also applied by an inline script in index.html so the
 * page never flashes light before React mounts.
 */
export const THEME_STORAGE_KEY = 'gestao-horas-theme';

const ThemeContext = createContext(null);

const readStored = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const getInitialTheme = () => {
  const stored = readStored();
  if (stored) return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply to <html> (tokens + Bootstrap colour mode).
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-bs-theme', theme);
  }, [theme]);

  // Follow the OS preference ONLY until the user makes an explicit choice
  // (persisting happens in setTheme/toggleTheme, not here — otherwise the very
  // first render would "lock in" a choice the user never made).
  useEffect(() => {
    if (readStored()) return undefined;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const onChange = (e) => {
      if (!readStored()) setThemeState(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const persist = (next) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode) — theme still works for this session */
    }
  };

  const setTheme = useCallback((value) => {
    const next = value === 'dark' ? 'dark' : 'light';
    persist(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = { children: PropTypes.node };

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};

/**
 * MuiThemeBridge — makes the MUI date/time pickers (used in ferias/horas)
 * follow the app theme. Without this they would stay light on a dark page.
 */
export const MuiThemeBridge = ({ children }) => {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => createTheme({ palette: { mode: theme } }), [theme]);
  return <MuiProvider theme={muiTheme}>{children}</MuiProvider>;
};

MuiThemeBridge.propTypes = { children: PropTypes.node };
