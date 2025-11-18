// Theme API for extensible Material Design-inspired theming

export interface Theme {
    id: string;
    name: string;
    themeObject: object;
    isDark: boolean;
}

export interface ThemeManager {
    registerTheme: (theme: Theme) => void;
    setTheme: (themeId: string) => void;
    getCurrentTheme: () => Theme;
    getAvailableThemes: () => Theme[];
}