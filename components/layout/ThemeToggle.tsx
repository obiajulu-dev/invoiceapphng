'use client';

import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-6 hover:opacity-80 transition-opacity"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M19.46 10.671c.04.3-.29.52-.55.37A8 8 0 0 1 9.08 1.08c.15-.26.07-.6-.22-.73A8 8 0 0 0 .33 14.4c.18.23.5.21.69.04.19-.17.41-.31.64-.42A8 8 0 0 1 19.46 10.67Z"
                        fill="#858BB2"
                    />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M9.817 16.18a6.182 6.182 0 0 1-6.183-6.182C3.634 6.575 6.575 3.634 10 3.634c.358 0 .716.03 1.067.09.263.044.424.305.367.566-.057.261-.29.428-.553.396a5.06 5.06 0 0 0-.881-.077c-2.834 0-5.134 2.3-5.134 5.134 0 2.835 2.3 5.135 5.134 5.135.301 0 .602-.026.896-.078.263-.032.526.135.583.396.057.261-.104.522-.367.566a6.183 6.183 0 0 1-1.067.09Z"
                        fill="#858BB2"
                    />
                </svg>
            )}
        </button>
    );
};