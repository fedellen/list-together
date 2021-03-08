import { useEffect, useState } from 'react';
import { Theme } from '../types';

const initialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userPreference = window.localStorage.getItem('theme');
    if (userPreference === 'dark' || userPreference === 'light') {
      return userPreference;
    }

    const userMedia = window.matchMedia('prefers-color-scheme: dark');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

export default function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;

    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);

    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
