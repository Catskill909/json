import React, { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline, Typography } from "@mui/material";
import Editor from "@monaco-editor/react";
import { themes } from "./themes";
import Layout from "./components/Layout";
import ControlsBar from "./components/ControlsBar";
import HelpModal from "./components/HelpModal";
import schemaValidatorPlugin from "./plugins/schemaValidator";

function App() {
  // State
  const [inputValue, setInputValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [formatted, setFormatted] = useState("");
  const [messages, setMessages] = useState<React.ReactNode>(null);
  const [themeId, setThemeId] = useState(themes[0].id);
  const [useProxy, setUseProxy] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  

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
      setMessages(
        <span style={{ color: "#ef5350", fontFamily: "Inter, sans-serif" }}>
          {e.message || "Invalid JSON"}
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
      
      // Use local proxy if enabled and not fetching localhost
      if (useProxy && !urlValue.includes("localhost")) {
         fetchUrl = `http://localhost:8010/proxy/${urlValue}`;
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
        setFormatted(JSON.stringify(parsed, null, 2));
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
                JSON Tool Pro
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
              onHelp={() => setHelpOpen(true)}
            />
          }
          messages={
            <div style={{ minHeight: 24, fontSize: 14, fontWeight: 500 }}>
                {messages}
            </div>
          }
          leftPane={
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
      </div>
    </ThemeProvider>
  );
}

export default App;
