import React, { useState, useEffect } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Stack,
  Alert,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Editor from '@monaco-editor/react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

interface SchemaValidatorProps {
  jsonData: string;
  isDark?: boolean;
}

interface ValidationError {
  path: string;
  message: string;
  keyword?: string;
}

const SchemaValidator: React.FC<SchemaValidatorProps> = ({ jsonData, isDark }) => {
  const [schemaInput, setSchemaInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: ValidationError[];
  } | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Sample schemas for quick testing
  const sampleSchemas = {
    basic: JSON.stringify({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number', minimum: 0 },
        email: { type: 'string', format: 'email' }
      },
      required: ['name', 'email']
    }, null, 2),
    
    api: JSON.stringify({
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['success', 'error'] },
        data: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['status']
    }, null, 2),
  };

  const validateAgainstSchema = () => {
    if (!schemaInput.trim() || !jsonData.trim()) {
      setValidationResult({
        valid: false,
        errors: [{ path: '', message: 'Both JSON data and schema are required' }]
      });
      return;
    }

    try {
      const schema = JSON.parse(schemaInput);
      const data = JSON.parse(jsonData);

      const ajv = new Ajv({ allErrors: true, verbose: true });
      addFormats(ajv);
      
      const validate = ajv.compile(schema);
      const valid = validate(data);

      if (valid) {
        setValidationResult({
          valid: true,
          errors: []
        });
      } else {
        const errors: ValidationError[] = (validate.errors || []).map(err => ({
          path: err.instancePath || '(root)',
          message: err.message || 'Validation error',
          keyword: err.keyword
        }));
        
        setValidationResult({
          valid: false,
          errors
        });
      }
    } catch (e: any) {
      setValidationResult({
        valid: false,
        errors: [{ 
          path: '', 
          message: `Error: ${e.message}` 
        }]
      });
    }
  };

  const loadSampleSchema = (type: 'basic' | 'api') => {
    setSchemaInput(sampleSchemas[type]);
  };

  const clearSchema = () => {
    setSchemaInput('');
    setValidationResult(null);
  };

  // Auto-validate when schema or data changes (with debounce)
  useEffect(() => {
    if (schemaInput && jsonData) {
      const timer = setTimeout(() => {
        validateAgainstSchema();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [schemaInput, jsonData]);

  return (
    <Accordion 
      expanded={expanded} 
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{ 
        backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
        '&:before': { display: 'none' }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: isDark ? '#252525' : '#e0e0e0',
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 2
          }
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          JSON Schema Validation
        </Typography>
        {validationResult && (
          <Chip
            icon={validationResult.valid ? <CheckCircleIcon /> : <ErrorIcon />}
            label={validationResult.valid ? 'Valid' : `${validationResult.errors.length} Error(s)`}
            color={validationResult.valid ? 'success' : 'error'}
            size="small"
          />
        )}
      </AccordionSummary>
      
      <AccordionDetails>
        <Stack spacing={2}>
          {/* Sample Schema Buttons */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => loadSampleSchema('basic')}
            >
              Load Basic Schema
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => loadSampleSchema('api')}
            >
              Load API Schema
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={clearSchema}
            >
              Clear Schema
            </Button>
          </Stack>

          {/* Schema Editor */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              JSON Schema (Draft 7 / 2019-09 / 2020-12):
            </Typography>
            <Box sx={{ 
              border: `1px solid ${isDark ? '#444' : '#ccc'}`, 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Editor
                height="200px"
                defaultLanguage="json"
                value={schemaInput}
                onChange={(v) => setSchemaInput(v || '')}
                theme={isDark ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, monospace",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                }}
              />
            </Box>
          </Box>

          {/* Validation Button */}
          <Button 
            variant="contained" 
            onClick={validateAgainstSchema}
            disabled={!schemaInput || !jsonData}
          >
            Validate Against Schema
          </Button>

          {/* Validation Results */}
          {validationResult && (
            <Box>
              {validationResult.valid ? (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ✓ JSON is valid according to the schema
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="error" icon={<ErrorIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Schema Validation Failed:
                  </Typography>
                  <Stack spacing={1}>
                    {validationResult.errors.map((err, idx) => (
                      <Box 
                        key={idx}
                        sx={{ 
                          pl: 2, 
                          borderLeft: '3px solid #f44336',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.85rem'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Path: <code>{err.path}</code>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {err.message}
                          {err.keyword && ` (${err.keyword})`}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Alert>
              )}
            </Box>
          )}

          {/* Info */}
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Schema validation runs automatically as you type. Supports JSON Schema Draft 7, 2019-09, and 2020-12.
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default SchemaValidator;
