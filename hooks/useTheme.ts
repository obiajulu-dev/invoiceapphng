import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Theme } from '@/types';

export const useTheme = (): { theme: Theme; toggleTheme: () => void; isInitialized: boolean } => {
    const [theme, setTheme, isInitialized] = useLocalStorage<Theme>('theme', 'light');

    useEffect(() => {
        if (isInitialized) {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
        }
    }, [theme, isInitialized]);

    const toggleTheme = (): void => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme, isInitialized };
};