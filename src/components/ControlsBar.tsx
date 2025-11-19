// ControlsBar: Top bar for input, URL fetch, copy, download, theme switch

import React from "react";
import {
    Stack,
    TextField,
    IconButton,
    Button,
    Menu,
    MenuItem,
    ListItemText,
    Autocomplete,
    Paper,
    Box,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faDownload, 
  faCloudArrowDown, 
  faMoon,
  faTrashCan, 
  faCircleQuestion,
  faGear,
  faCheckCircle,
  faAlignJustify,
  faCompressAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import ModernTooltip from "./ModernTooltip";
import type { ConversionFormat } from "../core/conversion";

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
    onSettings: () => void;
    onSchema: () => void;
    onConvert: (format: ConversionFormat) => void;
    conversionOptions: { format: ConversionFormat; label: string }[];
}

const HISTORY_KEY = 'json-tool-url-history';
const MAX_HISTORY = 10;

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
    onSettings,
    onSchema,
    onConvert,
    conversionOptions,
}) => {
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [history, setHistory] = React.useState<string[]>([]);

    React.useEffect(() => {
        try {
            const stored = localStorage.getItem(HISTORY_KEY);
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load URL history', e);
        }
    }, []);

    const saveToHistory = (url: string) => {
        if (!url || !url.trim()) return;
        
        const newHistory = [url, ...history.filter(h => h !== url)].slice(0, MAX_HISTORY);
        setHistory(newHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    };

    const handleFetch = () => {
        saveToHistory(urlValue);
        onFetchUrl();
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => setMenuAnchor(null);

    const handleSelect = (format: ConversionFormat) => {
        onConvert(format);
        handleMenuClose();
    };

    const menuOpen = Boolean(menuAnchor);

    return (
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
            <Autocomplete
                freeSolo
                options={history}
                value={urlValue}
                onChange={(_, newValue) => {
                    if (typeof newValue === 'string') {
                        onUrlChange(newValue);
                    }
                }}
                onInputChange={(_, newInputValue) => {
                    onUrlChange(newInputValue);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleFetch();
                    }
                }}
                openOnFocus
                sx={{ flex: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Enter URL to fetch JSON"
                        size="small"
                        variant="outlined"
                        inputProps={{ 
                            ...params.inputProps,
                            "aria-label": "Enter JSON URL" 
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5, width: '100%' }}>
                            <FontAwesomeIcon icon={faClock} style={{ color: '#90a4ae', fontSize: '0.85rem' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Inter, sans-serif' }}>
                                {option}
                            </Typography>
                        </Box>
                    </li>
                )}
                PaperComponent={(props) => (
                    <Paper 
                        {...props} 
                        elevation={4}
                        sx={{ 
                            mt: 1,
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            '& .MuiAutocomplete-listbox': {
                                padding: 1,
                                '& li': {
                                    borderRadius: 1,
                                    mb: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    }
                                }
                            }
                        }} 
                    />
                )}
            />
            <ModernTooltip title="Fetch JSON from URL" arrow placement="bottom">
                <IconButton
                    onClick={handleFetch}
                    disableRipple
                    sx={{
                        color: '#29b6f6',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#4fc3f7',
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(41, 182, 246, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCloudArrowDown} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Convert current JSON" arrow placement="bottom">
                <Button
                    variant="contained"
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleMenuOpen}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                        backgroundColor: '#2c2c2c',
                        color: '#f5f5f5',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                        '&:hover': {
                            backgroundColor: '#3a3a3a',
                            borderColor: 'rgba(255, 255, 255, 0.18)',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)'
                        }
                    }}
                >
                    Format
                </Button>
            </ModernTooltip>
            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    "aria-labelledby": "format-convert-button",
                    dense: true,
                }}
            >
                {conversionOptions.map(option => (
                    <MenuItem key={option.format} onClick={() => handleSelect(option.format)}>
                        <ListItemText
                            primary={option.label}
                            primaryTypographyProps={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                        />
                    </MenuItem>
                ))}
            </Menu>
            <ModernTooltip title="Format (Pretty)" arrow placement="bottom">
                <IconButton
                    onClick={() => onFormat('pretty')}
                    disableRipple
                    sx={{
                        color: '#66bb6a',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#81c784',
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(102, 187, 106, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faAlignJustify} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Minify" arrow placement="bottom">
                <IconButton
                    onClick={() => onFormat('minified')}
                    disableRipple
                    sx={{
                        color: '#ffa726',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#ffb74d',
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(255, 167, 38, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCompressAlt} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Copy formatted JSON" arrow placement="bottom">
                <IconButton
                    onClick={onCopy}
                    disableRipple
                    sx={{
                        color: '#ab47bc',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#ba68c8',
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(171, 71, 188, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCopy} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Download formatted JSON" arrow placement="bottom">
                <IconButton
                    onClick={onDownload}
                    disableRipple
                    sx={{
                        color: '#42a5f5',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#64b5f6',
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(66, 165, 245, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faDownload} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Clear All" arrow placement="bottom">
                <IconButton
                    onClick={onClear}
                    disableRipple
                    sx={{
                        color: '#ef5350',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#e57373',
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(239, 83, 80, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faTrashCan} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Toggle dark/light theme" arrow placement="bottom">
                <IconButton
                    onClick={onThemeToggle}
                    disableRipple
                    sx={{
                        color: '#ffb300',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#ffc107',
                            transform: 'rotate(20deg) translateY(-2px)',
                            backgroundColor: 'rgba(255, 179, 0, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faMoon} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Schema Validation" arrow placement="bottom">
                <IconButton
                    onClick={onSchema}
                    disableRipple
                    sx={{
                        color: '#4caf50',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#66bb6a',
                            transform: 'scale(1.1) translateY(-2px)',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Format Settings" arrow placement="bottom">
                <IconButton
                    onClick={onSettings}
                    disableRipple
                    sx={{
                        color: '#78909c',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#90a4ae',
                            transform: 'rotate(90deg) translateY(-2px)',
                            backgroundColor: 'rgba(120, 144, 156, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faGear} size="lg" />
                </IconButton>
            </ModernTooltip>
            <ModernTooltip title="Help & Instructions" arrow placement="bottom">
                <IconButton
                    onClick={onHelp}
                    disableRipple
                    sx={{
                        color: '#26c6da',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        '&:hover': {
                            color: '#4dd0e1',
                            transform: 'scale(1.1) translateY(-2px)',
                            backgroundColor: 'rgba(38, 198, 218, 0.1)'
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
                </IconButton>
            </ModernTooltip>
        </Stack>
    );
};

export default ControlsBar;