// ControlsBar: Top bar for input, URL fetch, copy, download, theme switch

import React from "react";
import { Stack, TextField, IconButton, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface ControlsBarProps {
    urlValue: string;
    onUrlChange: (v: string) => void;
    onFetchUrl: () => void;
    onFormat: (mode: 'pretty' | 'minified') => void;
    onCopy: () => void;
    onDownload: () => void;
    onClear: () => void;
    onThemeToggle: () => void;
    onHelp: () => void;
}

const ControlsBar: React.FC<ControlsBarProps> = ({
    urlValue,
    onUrlChange,
    onFetchUrl,
    onFormat,
    onCopy,
    onDownload,
    onClear,
    onThemeToggle,
    onHelp,
}) => (
    <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        sx={{
            width: "100%",
            transition: "flex-direction 0.3s",
            "& .MuiIconButton-root": {
                transition: "background 0.2s, box-shadow 0.2s",
            },
        }}
        role="toolbar"
        aria-label="JSON Tool Controls"
    >
        <TextField
            label="Enter URL to fetch JSON"
            value={urlValue}
            onChange={e => onUrlChange(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            variant="outlined"
            inputProps={{ "aria-label": "Enter JSON URL" }}
        />
        <Tooltip title="Fetch JSON from URL">
            <span>
                <IconButton
                    onClick={onFetchUrl}
                    color="primary"
                    aria-label="Fetch JSON from URL"
                    tabIndex={0}
                >
                    <CloudDownloadIcon />
                </IconButton>
            </span>
        </Tooltip>
        <Tooltip title="Format (Pretty)">
            <IconButton onClick={() => onFormat('pretty')} color="primary">
                <Typography variant="button" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{`{ }`}</Typography>
            </IconButton>
        </Tooltip>
        <Tooltip title="Minify">
            <IconButton onClick={() => onFormat('minified')} color="primary">
                <Typography variant="button" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{`><`}</Typography>
            </IconButton>
        </Tooltip>
        <Tooltip title="Copy formatted JSON">
            <span>
                <IconButton
                    onClick={onCopy}
                    color="primary"
                    aria-label="Copy formatted JSON"
                    tabIndex={0}
                >
                    <ContentCopyIcon />
                </IconButton>
            </span>
        </Tooltip>
        <Tooltip title="Download formatted JSON">
            <span>
                <IconButton
                    onClick={onDownload}
                    color="primary"
                    aria-label="Download formatted JSON"
                    tabIndex={0}
                >
                    <DownloadIcon />
                </IconButton>
            </span>
        </Tooltip>
        <Tooltip title="Clear All">
            <IconButton onClick={onClear} color="error">
                <DeleteOutlineIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Toggle dark/light theme">
            <span>
                <IconButton
                    onClick={onThemeToggle}
                    color="primary"
                    aria-label="Toggle dark/light theme"
                    tabIndex={0}
                >
                    <Brightness4Icon />
                </IconButton>
            </span>
        </Tooltip>
        <Tooltip title="Help & Instructions">
            <IconButton onClick={onHelp} color="info">
                <HelpOutlineIcon />
            </IconButton>
        </Tooltip>
    </Stack>
);

export default ControlsBar;