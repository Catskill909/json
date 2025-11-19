import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Typography,
  Divider,
} from '@mui/material';

export interface FormatOptions {
  indentSize: number;
  indentType: 'spaces' | 'tabs';
  quoteStyle: 'double' | 'single';
  trailingComma: boolean;
}

interface FormatSettingsProps {
  open: boolean;
  onClose: () => void;
  options: FormatOptions;
  onChange: (options: FormatOptions) => void;
}

const FormatSettings: React.FC<FormatSettingsProps> = ({ open, onClose, options, onChange }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Formatting Options
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {/* Indent Type */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              Indentation Type
            </FormLabel>
            <RadioGroup
              value={options.indentType}
              onChange={(e) => onChange({ ...options, indentType: e.target.value as 'spaces' | 'tabs' })}
            >
              <FormControlLabel value="spaces" control={<Radio />} label="Spaces" />
              <FormControlLabel value="tabs" control={<Radio />} label="Tabs" />
            </RadioGroup>
          </FormControl>

          <Divider />

          {/* Indent Size (only for spaces) */}
          {options.indentType === 'spaces' && (
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                Indent Size (Spaces)
              </FormLabel>
              <RadioGroup
                value={options.indentSize.toString()}
                onChange={(e) => onChange({ ...options, indentSize: parseInt(e.target.value) })}
              >
                <FormControlLabel value="2" control={<Radio />} label="2 spaces" />
                <FormControlLabel value="4" control={<Radio />} label="4 spaces" />
                <FormControlLabel value="8" control={<Radio />} label="8 spaces" />
              </RadioGroup>
            </FormControl>
          )}

          <Divider />

          {/* Quote Style */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              Quote Style (for keys)
            </FormLabel>
            <RadioGroup
              value={options.quoteStyle}
              onChange={(e) => onChange({ ...options, quoteStyle: e.target.value as 'double' | 'single' })}
            >
              <FormControlLabel value="double" control={<Radio />} label='Double quotes ("key")' />
              <FormControlLabel value="single" control={<Radio />} label="Single quotes ('key')" />
            </RadioGroup>
          </FormControl>

          <Divider />

          {/* Trailing Comma */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              Trailing Commas
            </FormLabel>
            <RadioGroup
              value={options.trailingComma ? 'yes' : 'no'}
              onChange={(e) => onChange({ ...options, trailingComma: e.target.value === 'yes' })}
            >
              <FormControlLabel value="no" control={<Radio />} label="No trailing commas (JSON standard)" />
              <FormControlLabel value="yes" control={<Radio />} label="Add trailing commas (JS-style)" />
            </RadioGroup>
          </FormControl>

          <Button variant="contained" onClick={onClose} fullWidth sx={{ mt: 2 }}>
            Done
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default FormatSettings;
