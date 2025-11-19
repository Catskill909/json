import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CodeIcon from "@mui/icons-material/Code";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SecurityIcon from "@mui/icons-material/Security";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SettingsIcon from "@mui/icons-material/Settings";
import VerifiedIcon from "@mui/icons-material/Verified";
import TransformIcon from "@mui/icons-material/Transform";
import RssFeedIcon from "@mui/icons-material/RssFeed";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1e1e1e",
          color: "#e0e0e0",
          borderRadius: 3,
          border: "1px solid #333",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)"
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: "Oswald, sans-serif", fontSize: "1.8rem", pb: 1 }}>
        SuperSoul JSON Tool - User Guide
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3, color: "#bdbdbd" }}>
          Welcome to the ultimate JSON development environment. Here's everything you can do:
        </Typography>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Box>
                 <Typography variant="h6" sx={{ fontFamily: "Oswald, sans-serif", color: "#90caf9", mb: 1 }}>
                    Core Features
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemIcon><CodeIcon sx={{ color: "#66bb6a" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Monaco Editor" 
                            secondary="Professional-grade editor with syntax highlighting, auto-validation, and detailed error messages showing exact line & column numbers." 
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><UploadFileIcon sx={{ color: "#ab47bc" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Drag & Drop Upload" 
                            secondary="Drag JSON files directly into the editor or click to browse. Beautiful overlay appears when editor is empty."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><CloudDownloadIcon sx={{ color: "#29b6f6" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Fetch from URL" 
                            secondary="Enter any URL to fetch JSON. Built-in CORS proxy bypasses restrictions automatically."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><RssFeedIcon sx={{ color: "#ff9800" }} /></ListItemIcon>
                        <ListItemText 
                            primary="XML/RSS/Atom Support" 
                            secondary="Auto-detects and converts XML, RSS, and Atom feeds to JSON on-the-fly when fetching from URLs."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><DeleteOutlineIcon sx={{ color: "#ef5350" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Format & Utilities" 
                            secondary="Minify, Prettify, Copy, Download, and Clear. One-click operations for all common tasks."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                </List>
            </Box>

             <Box>
                 <Typography variant="h6" sx={{ fontFamily: "Oswald, sans-serif", color: "#ffa726", mb: 1 }}>
                    Advanced Features
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemIcon><TransformIcon sx={{ color: "#e91e63" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Format Conversion Panel" 
                            secondary="Click 'Format' dropdown to convert JSON to YAML, CSV, XML, TypeScript Interfaces, Dart Classes, or minified/pretty JSON. Output appears in a side pane with copy/download controls."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><VerifiedIcon sx={{ color: "#4caf50" }} /></ListItemIcon>
                        <ListItemText 
                            primary="JSON Schema Validation" 
                            secondary="Validate JSON against schemas (Draft 7/2019-09/2020-12). Click the ✓ Schema button to open the validator."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><SettingsIcon sx={{ color: "#ff9800" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Custom Formatting" 
                            secondary="Click ⚙️ Settings to configure indent size (2/4/8 spaces or tabs), quote style (single/double), and trailing commas."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><SecurityIcon sx={{ color: "#ffa726" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Privacy First" 
                            secondary="All JSON processing happens client-side in your browser. Your data is never sent to any server or stored anywhere."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                     <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: "#ab47bc" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Dark/Light Themes" 
                            secondary="Toggle themes with the 🌙 button. Layout adapts to your screen size automatically."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                </List>
            </Box>
        </Box>
        
        <Divider sx={{ my: 2, borderColor: "#333" }} />
        <Typography variant="caption" sx={{ color: "#666", display: "block", textAlign: "center" }}>
            SuperSoul JSON Tool v2.1.0 &bull; Format Conversion Panel Live &bull; Built for Developers
        </Typography>

      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpModal;
