import React, { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline, Typography, Box } from "@mui/material";
import Editor from "@monaco-editor/react";
import { themes } from "./themes";
import Layout from "./components/Layout";
import ControlsBar from "./components/ControlsBar";
import HelpModal from "./components/HelpModal";
import FormatSettings, { type FormatOptions } from "./components/FormatSettings";
import SchemaValidator from "./components/SchemaValidator";
import schemaValidatorPlugin from "./plugins/schemaValidator";
import { getProxyUrl, shouldUseProxy } from "./utils/env";

function App() {
  // State
  const [inputValue, setInputValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [formatted, setFormatted] = useState("");
  const [messages, setMessages] = useState<React.ReactNode>(null);
  const [themeId, setThemeId] = useState(themes[0].id);
  const [useProxy, setUseProxy] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    indentSize: 2,
    indentType: 'spaces',
    quoteStyle: 'double',
    trailingComma: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  

  // Setup validation
  const validators = useMemo(() => {
    const plugin = schemaValidatorPlugin;
    let validator: any = null;
    plugin.register({
      addValidator: (v: any) => {
        validator = v;
      },
    });
    return validator ? [validator] : [];
  }, []);

  const validateJson = (json: any) => {
    let result = { valid: true, errors: [] as string[] };
    for (const v of validators) {
      const r = v.validate(json);
      if (!r.valid) {
        result.valid = false;
        if (r.errors) result.errors.push(...r.errors);
      }
    }
    return result;
  };

  // Handle Input Change (Left Pane)
  const handleInputChange = (v: string | undefined) => {
    const val = v || "";
    setInputValue(val);
    
    try {
      if (!val.trim()) {
        setFormatted("");
        setMessages(null);
        return;
      }
      const parsed = JSON.parse(val);
      setFormatted(JSON.stringify(parsed, null, 2));
      const validationResult = validateJson(parsed);
      
      if (!validationResult.valid) {
         setMessages(
          <span style={{ color: "#ef5350", fontFamily: "Inter, sans-serif" }}>
            {validationResult.errors?.join(", ") || "Validation failed"}
          </span>
        );
      } else {
        setMessages(
            <span style={{ color: "#66bb6a", fontFamily: "Inter, sans-serif" }}>
                Valid JSON
            </span>
        );
      }
    } catch (e: any) {
      // Do not clear formatted on error to avoid flickering, just show error
      // setFormatted(""); 
      
      // Enhanced error message with line/column if available
      let errorMsg = e.message || "Invalid JSON";
      
      // Try to extract line/column from error message
      // Chrome/V8 format: "Unexpected token } in JSON at position 42"
      // Firefox format: "JSON.parse: unexpected character at line 2 column 3"
      const posMatch = errorMsg.match(/at position (\d+)/);
      const lineColMatch = errorMsg.match(/line (\d+) column (\d+)/);
      
      if (posMatch && val) {
        const pos = parseInt(posMatch[1]);
        const lines = val.substring(0, pos).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        errorMsg = `${errorMsg.split(' at position')[0]} at line ${line}, column ${col}`;
      } else if (lineColMatch) {
        // Firefox already has line/col, keep as is
        errorMsg = errorMsg;
      }
      
      setMessages(
        <span style={{ color: "#ef5350", fontFamily: "Inter, sans-serif" }}>
          ⚠️ {errorMsg}
        </span>
      );
    }
  };

  // Handle URL Fetch
  const handleFetchUrl = async () => {
    if (!urlValue) return;
    try {
      setMessages(<span style={{ color: "#29b6f6", fontFamily: "Inter, sans-serif" }}>Fetching...</span>);
      let fetchUrl = urlValue;
      
      // Use proxy if enabled and URL should be proxied
      if (useProxy && shouldUseProxy(urlValue)) {
         // Environment-aware proxy URL (works in dev and production)
         fetchUrl = getProxyUrl(urlValue);
      }

      const res = await fetch(fetchUrl);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
         console.warn("Warning: Content-Type is not JSON:", contentType);
      }
      const text = await res.text();
      
      setInputValue(text);
      handleInputChange(text); // Trigger validation and formatting
      
    } catch (e: any) {
      let isCors = false;
      if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
         isCors = true;
      }
      
      setMessages(
        <span style={{ color: "#ef5350", fontFamily: "Inter, sans-serif" }}>
          Error: {e.message}
          {isCors && (
            <>
              <br />
              <span style={{ color: "#ffa726", fontSize: "0.9em" }}>
                If you are seeing this, ensure the proxy server is running: <code>npm run server</code>
              </span>
            </>
          )}
        </span>
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setMessages(<span style={{ color: "#66bb6a", fontFamily: "Inter, sans-serif" }}>Copied formatted JSON!</span>);
    setTimeout(() => setMessages(null), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessages(<span style={{ color: "#66bb6a", fontFamily: "Inter, sans-serif" }}>Downloaded!</span>);
  };

  const handleFormat = (mode: 'pretty' | 'minified') => {
    if (!inputValue) return;
    try {
      const parsed = JSON.parse(inputValue);
      if (mode === 'pretty') {
        const indent = formatOptions.indentType === 'tabs' ? '\t' : ' '.repeat(formatOptions.indentSize);
        let formatted = JSON.stringify(parsed, null, indent);
        
        // Apply quote style (single quotes)
        if (formatOptions.quoteStyle === 'single') {
          formatted = formatted.replace(/"([^"]+)":/g, "'$1':");
        }
        
        // Add trailing commas if enabled
        if (formatOptions.trailingComma) {
          formatted = formatted.replace(/(\S)(\n\s*[}\]])/g, '$1,$2');
        }
        
        setFormatted(formatted);
        setMessages(<span style={{ color: "#66bb6a", fontFamily: "Inter, sans-serif" }}>Formatted (Pretty)!</span>);
      } else {
        setFormatted(JSON.stringify(parsed));
        setMessages(<span style={{ color: "#66bb6a", fontFamily: "Inter, sans-serif" }}>Minified!</span>);
      }
    } catch (e) {
      setMessages(<span style={{ color: "#ef5350", fontFamily: "Inter, sans-serif" }}>Invalid JSON, cannot format</span>);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setFormatted("");
    setUrlValue("");
    setMessages(null);
  };

  const handleFileLoad = (content: string, filename: string) => {
    setInputValue(content);
    handleInputChange(content);
    setMessages(
      <span style={{ color: "#66bb6a", fontFamily: "Inter, sans-serif" }}>
        ✓ Loaded {filename}
      </span>
    );
  };

  // Theme switching
  const handleThemeToggle = () => {
    const idx = themes.findIndex(t => t.id === themeId);
    const next = (idx + 1) % themes.length;
    setThemeId(themes[next].id);
  };

  const currentTheme = useMemo(() => {
    return themes.find(t => t.id === themeId)?.themeObject || themes[0].themeObject;
  }, [themeId]);

  const isDark = themes.find(t => t.id === themeId)?.isDark;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div style={{ 
          width: "100vw", 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden",
          fontFamily: "Inter, sans-serif"
      }}>
        <div style={{ 
            padding: "12px 16px", 
            background: isDark ? "#1e1e1e" : "#f5f5f5", 
            borderBottom: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
            display: "flex",
            alignItems: "center",
            gap: 16
        }}>
            <Typography variant="h6" style={{ fontWeight: 600, letterSpacing: -0.5, color: isDark ? "#fff" : "#333" }}>
                SuperSoul JSON Tool
            </Typography>
            <div style={{ flex: 1 }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: isDark ? "#aaa" : "#666", cursor: "pointer" }}>
                    <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={e => setUseProxy(e.target.checked)}
                    style={{ accentColor: "#2196f3" }}
                    />
                    Enable CORS Proxy (Required for most external URLs)
                </label>
            </div>
        </div>

        <Layout
          controls={
            <ControlsBar
              urlValue={urlValue}
              onUrlChange={setUrlValue}
              onFetchUrl={handleFetchUrl}
              onFormat={handleFormat}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onClear={handleClear}
              onThemeToggle={handleThemeToggle}
              onSchema={() => setSchemaOpen(true)}
              onSettings={() => setSettingsOpen(true)}
              onHelp={() => setHelpOpen(true)}
            />
          }
          messages={
            <div style={{ minHeight: 24, fontSize: 14, fontWeight: 500 }}>
                {messages}
            </div>
          }
          leftPane={
            <Box 
              sx={{ position: 'relative', width: '100%', height: '100%' }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Only hide if leaving the container, not child elements
                if (e.currentTarget === e.target) {
                  setIsDragging(false);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                  const file = files[0];
                  if (file.type === 'application/json' || file.name.endsWith('.json')) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const content = evt.target?.result as string;
                      handleFileLoad(content, file.name);
                    };
                    reader.readAsText(file);
                  } else {
                    setMessages(
                      <span style={{ color: "#ef5350", fontFamily: "Inter, sans-serif" }}>
                        Please drop a JSON file (.json)
                      </span>
                    );
                  }
                }
              }}
            >
              {/* Drag overlay - only visible when dragging */}
              {isDragging && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0,
                  zIndex: 1000,
                  backgroundColor: isDark ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                  border: '3px dashed #2196f3',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 600 }}>
                    Drop JSON file here
                  </Typography>
                </Box>
              )}
              
              <Editor
                height="100%"
                defaultLanguage="json"
                value={inputValue}
                onChange={handleInputChange}
                theme={isDark ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  renderLineHighlight: "none",
                }}
              />
            </Box>
          }
          rightPane={
            <Editor
              height="100%"
              defaultLanguage="json"
              value={formatted}
              theme={isDark ? "vs-dark" : "light"}
              options={{
                readOnly: true,
                minimap: { enabled: true },
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                wordWrap: "wordWrapColumn",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: "none",
              }}
            />
          }
        />

        <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        <SchemaValidator 
          open={schemaOpen}
          onClose={() => setSchemaOpen(false)}
          jsonData={inputValue}
          isDark={isDark}
        />
        <FormatSettings 
          open={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          options={formatOptions}
          onChange={setFormatOptions}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
