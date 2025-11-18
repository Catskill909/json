// Theme registry for the app

import materialDarkTheme from "./materialDark";
import materialLightTheme from "./materialLight";

export const themes = [
    {
        id: "material-dark",
        name: "Material Dark",
        themeObject: materialDarkTheme,
        isDark: true,
    },
    {
        id: "material-light",
        name: "Material Light",
        themeObject: materialLightTheme,
        isDark: false,
    },
];

// Default theme export
export default materialDarkTheme;