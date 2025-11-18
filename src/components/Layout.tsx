// Layout component: controls/messages above, side-by-side panes

import React from "react";
import type { ReactNode } from "react";
import { Box, Paper, Stack } from "@mui/material";

interface LayoutProps {
    controls: ReactNode;
    messages: ReactNode;
    leftPane: ReactNode;
    rightPane: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ controls, messages, leftPane, rightPane }) => (
    <Stack spacing={2} sx={{ height: "100vh", p: 2 }}>
        <Box>{controls}</Box>
        <Box>{messages}</Box>
        <Box
            sx={{
                flex: 1,
                display: "flex",
                gap: 2,
                minHeight: 0,
                flexDirection: { xs: "column", md: "row" },
                transition: "flex-direction 0.3s",
                height: 0 // Ensures children fill remaining space
            }}
            role="main"
            aria-label="JSON Formatter Panes"
        >
            <Paper
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    p: 0,
                    transition: "box-shadow 0.2s",
                    outline: "none"
                }}
                tabIndex={0}
                aria-label="Raw JSON Input Pane"
                elevation={3}
            >
                {leftPane}
            </Paper>
            <Paper
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    p: 0,
                    transition: "box-shadow 0.2s",
                    outline: "none"
                }}
                tabIndex={0}
                aria-label="Formatted JSON Output Pane"
                elevation={3}
            >
                {rightPane}
            </Paper>
        </Box>
    </Stack>
);

export default Layout;