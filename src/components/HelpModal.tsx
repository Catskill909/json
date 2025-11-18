import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CodeIcon from "@mui/icons-material/Code";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SecurityIcon from "@mui/icons-material/Security";

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
        How to Use JSON Tool Pro
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3, color: "#bdbdbd" }}>
          Welcome to the ultimate JSON development environment. Here's how to get the most out of it:
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
                            primary="Editor & Validator" 
                            secondary="Paste JSON on the left. It auto-validates and formats. Errors are highlighted in real-time." 
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><CloudDownloadIcon sx={{ color: "#29b6f6" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Fetch URL" 
                            secondary="Enter any URL to fetch JSON. Includes a built-in Proxy to bypass CORS restrictions automatically."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><DeleteOutlineIcon sx={{ color: "#ef5350" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Utilities" 
                            secondary="Minify, Prettify, Copy, Download, and Clear your workspace with one click."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                </List>
            </Box>

             <Box>
                 <Typography variant="h6" sx={{ fontFamily: "Oswald, sans-serif", color: "#ffa726", mb: 1 }}>
                    Pro Tips
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemIcon><SecurityIcon sx={{ color: "#ffa726" }} /></ListItemIcon>
                        <ListItemText 
                            primary="CORS Proxy" 
                            secondary={
                                <span>
                                    If a URL fails, ensure the local proxy is running via <code style={{ background: '#333', padding: '2px 4px', borderRadius: 4 }}>npm run dev</code>. It handles SSL & Headers for you.
                                </span>
                            }
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                     <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: "#ab47bc" }} /></ListItemIcon>
                        <ListItemText 
                            primary="Smart Layout" 
                            secondary="Toggle between Dark and Light themes. The layout adapts to your screen size automatically."
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: "#9e9e9e" }}
                        />
                    </ListItem>
                </List>
            </Box>
        </Box>
        
        <Divider sx={{ my: 2, borderColor: "#333" }} />
        <Typography variant="caption" sx={{ color: "#666", display: "block", textAlign: "center" }}>
            JSON Tool Pro v1.0.0 &bull; Built for Developers
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
