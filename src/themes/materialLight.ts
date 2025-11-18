// Material Design-inspired light theme for MUI

import { createTheme } from "@mui/material/styles";

const materialLightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#9c27b0",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        error: {
            main: "#d32f2f",
        },
        warning: {
            main: "#ed6c02",
        },
        info: {
            main: "#0288d1",
        },
        success: {
            main: "#2e7d32",
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: [
            "Inter",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif"
        ].join(","),
        fontWeightBold: 700,
        h1: { fontFamily: "Oswald, sans-serif", fontWeight: 700 },
        h2: { fontFamily: "Oswald, sans-serif", fontWeight: 700 },
        h3: { fontFamily: "Oswald, sans-serif", fontWeight: 700 },
        h4: { fontFamily: "Oswald, sans-serif", fontWeight: 700 },
        h5: { fontFamily: "Oswald, sans-serif", fontWeight: 700 },
        h6: { fontFamily: "Oswald, sans-serif", fontWeight: 700 },
        button: {
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    textTransform: "none",
                },
            },
        },
    },
});

export default materialLightTheme;
