// Material Design-inspired dark theme for MUI

import { createTheme } from "@mui/material/styles";

const materialDarkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        error: {
            main: "#ef5350",
        },
        warning: {
            main: "#ffa726",
        },
        info: {
            main: "#29b6f6",
        },
        success: {
            main: "#66bb6a",
        },
        text: {
            primary: "#e0e0e0",
            secondary: "#bdbdbd",
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

export default materialDarkTheme;