// Layout component: controls/messages above, side-by-side panes

import React from "react";
import type { ReactNode } from "react";
import { Box, Paper, Stack } from "@mui/material";

interface LayoutProps {
    controls: ReactNode;
    messages: ReactNode;
    leftPane: ReactNode;
    rightPane?: ReactNode;
    rightPaneVisible?: boolean;
    rightPaneAriaLabel?: string;
}

const Layout: React.FC<LayoutProps> = ({
    controls,
    messages,
    leftPane,
    rightPane,
    rightPaneVisible = true,
    rightPaneAriaLabel = "Formatted JSON Output Pane",
}) => {
    const showRightPane = Boolean(rightPaneVisible && rightPane);

    return (
        <Stack spacing={2} sx={{ height: "100vh", p: 2 }}>
            <Box>{controls}</Box>
            <Box>{messages}</Box>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    gap: showRightPane ? 2 : 0,
                    minHeight: 0,
                    flexDirection: { xs: "column", md: showRightPane ? "row" : "column" },
                    transition: "flex-direction 0.3s, gap 0.3s",
                    height: 0,
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
                        outline: "none",
                    }}
                    tabIndex={0}
                    aria-label="Raw JSON Input Pane"
                    elevation={3}
                >
                    {leftPane}
                </Paper>
                {showRightPane && (
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
                            outline: "none",
                        }}
                        tabIndex={0}
                        aria-label={rightPaneAriaLabel}
                        elevation={3}
                    >
                        {rightPane}
                    </Paper>
                )}
            </Box>
        </Stack>
    );
};

export default Layout;