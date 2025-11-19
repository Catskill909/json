# SuperSoul JSON Tool

A cutting-edge, professional JSON development environment with modern UI, powerful validation, and extensibility.

**Live Demo:** [https://json.supersoul.top](https://json.supersoul.top)

## ✨ Features

### Core Functionality
- **Monaco Editor**: Professional-grade editor with syntax highlighting and IntelliSense
- **Enhanced Error Messages**: Precise validation with line and column numbers
- **Drag & Drop Upload**: Seamless file upload - drag JSON files directly into the editor
- **CORS Proxy**: Built-in proxy server to fetch JSON from any URL without CORS issues

### Advanced Features
- **JSON Schema Validation**: Validate against schemas (Draft 7, 2019-09, 2020-12) with detailed error reporting
- **Customizable Formatting**: Configure indent size (2/4/8 spaces or tabs), quote style, and trailing commas
- **Format Conversion**: Prettify or minify JSON instantly
- **Quick Actions**: Copy to clipboard, download as file, clear workspace

### Modern UI/UX
- **Font Awesome Icons**: Clean, modern icon set with smooth animations
- **Glassmorphism Tooltips**: Beautiful dark tooltips with blur effects
- **Smooth Hover Effects**: Icons slide, rotate, and scale on hover
- **Dark/Light Themes**: Toggle between themes with smooth transitions
- **Responsive Design**: Adapts to any screen size

### Privacy & Performance
- **Client-Side Processing**: All JSON operations happen in your browser
- **No Data Storage**: Your data never leaves your machine
- **Fast & Lightweight**: Optimized for performance

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the App**
   ```bash
   npm run dev
   ```
   This command runs both the Vite frontend (http://localhost:5173) and the Proxy server (http://localhost:8010) concurrently.

## Project Structure

```
src/
  core/       # Core APIs (plugin, theme, manager)
  plugins/    # Pluggable features (schema, diff, etc.)
  themes/     # Theme modules (Material dark, custom)
  components/ # UI components (panes, controls, etc.)
  App.tsx     # Main app entry
  main.tsx    # Vite/React entry
```

## Deployment (Coolify + Nixpacks)

⚠️ **CRITICAL**: Before deploying, read [`DEPLOYMENT.md`](DEPLOYMENT.md) for the complete checklist and common pitfalls.

1. **Push to `main`** – Coolify pulls directly from `Catskill909/json:main`. All deployment logic lives in [`nixpacks.toml`](nixpacks.toml).
2. **Coolify settings**
   - Build pack: **Nixpacks**
   - Base directory & Publish directory: `/`
   - Start command: leave empty (Nixpacks uses `npm start` from `package.json`).
   - Domains: `https://json.supersoul.top` (allows www + non-www).
3. **Build phase (from `nixpacks.toml`)**
   ```toml
   [phases.setup]
   nixPkgs = ["nodejs_23"]

   [phases.build]
   cmds = [
     "find node_modules -mindepth 1 -maxdepth 1 ! -name '.cache' -exec rm -rf {} + || true",
     "rm -f package-lock.json",
     "npm install --force",
     "npm run build"
   ]
   ```
   This enforces Node 23 (required by Vite 7) and ensures Linux-specific optional dependencies such as `@rollup/rollup-linux-x64-gnu` are rebuilt inside the container.
4. **Runtime** – `npm start` launches the Express proxy/server (serves `/dist` + `/proxy`).

### Pre-Deployment Testing

**ALWAYS test production build locally before deploying:**
```bash
npm run build
npm start
# Visit http://localhost:8010 and test proxy functionality
```

### Troubleshooting notes from production rollout

1. **Rollup optional dependency missing** – occurs when the Linux build reuses a macOS `node_modules`. The clean `find … rm` plus `npm install --force` fixes it.
2. **Docker cache mount conflict** – Coolify mounts `/app/node_modules/.cache`. Removing the parent dir fails; instead we delete each child except `.cache` (current config already handles this).
3. **Express 5 wildcard routes** – Express 5 rejects `app.get('*')`/`app.get('/*')`. Use `app.use(express.static(...))` plus a final `app.use((req,res)=>res.sendFile(...))` middleware (see [`server/index.js`](server/index.js)). This resolved the `path-to-regexp` errors and the “no available server” health check failures.
4. **Hardcoded localhost URLs (Nov 18, 2025)** – Frontend was hardcoded to `http://localhost:8010/proxy/` which failed in production. **Solution**: Use environment-aware utilities in `src/utils/env.ts`. Never hardcode localhost URLs in frontend code - always use relative paths or environment detection. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for details.

## Extensibility

The tool supports a modular plugin system:
- **Plugins:** Add validators, panes, or controls via the plugin API
- **Themes:** Create custom themes using the theme API
- See `src/core/pluginApi.ts` and `src/core/themeApi.ts` for extension interfaces

## Contributing

Contributions welcome! Add new plugins in `src/plugins/` or themes in `src/themes/`.

## License

MIT
