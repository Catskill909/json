# JSON Tool Pro

A cutting-edge, professional JSON development environment with local proxy capabilities, modern design, and extensibility.

![JSON Tool Pro](https://via.placeholder.com/800x400?text=JSON+Tool+Pro+Preview)

## Features

- **Modern Interface**: Material Design with Dark/Light mode, using *Inter* and *JetBrains Mono* fonts. Headers styled with *Oswald*.
- **Monaco Editor**: Professional-grade editor with syntax highlighting, folding, and minimap.
- **CORS Proxy**: Built-in Node.js proxy server to bypass CORS restrictions and fetch JSON from any URL.
- **Utilities**:
  - **Prettify**: Format compact JSON.
  - **Minify**: Compress JSON for production.
  - **Validate**: Real-time error detection.
  - **Fetch**: Load JSON from external APIs easily.
- **Extensible**: Plugin architecture for validators and themes.

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

## Extensibility

- **Plugins:** Add new panes, controls, validators, or features by registering via the core plugin API.
- **Themes:** Swap or extend themes using the theme API.
- **Extension Points:** Documented APIs for easy integration.

## Getting Started

```bash
cd json-tool
npm install
npm run dev
```

## Contributing

- Add new plugins in `src/plugins/`
- Add or modify themes in `src/themes/`
## Plugin System

The JSON Tool supports a modular plugin system for extending functionality:

- **Panes:** Add new side-by-side or bottom panes for custom views.
- **Controls:** Add controls above the panes for new actions.
- **Validators:** Add custom JSON validators (e.g., schema, linting).
- **Themes:** Register new themes for the UI.

### Plugin API Example

```ts
// src/plugins/schemaValidator.ts
import type { Plugin } from "../core/pluginApi";

const schemaValidatorPlugin: Plugin = {
  id: "schema-validator",
  name: "Schema Validator",
  version: "1.0.0",
  register(ctx) {
    ctx.addValidator?.({
      id: "basic-schema",
      validate: (json) => ({
        valid: typeof json === "object" && json !== null,
        errors: typeof json === "object" && json !== null ? [] : ["Root must be an object"],
      }),
    });
  },
};
export default schemaValidatorPlugin;
```

### Registering Plugins

Add your plugin to `src/plugins/` and register it in the `PluginManager`.

```ts
// src/core/PluginManager.tsx
import schemaValidatorPlugin from "../plugins/schemaValidator";
// ...
schemaValidatorPlugin.register(pluginContext);
```

See [`src/core/pluginApi.ts`](src/core/pluginApi.ts) for all extension points.
- See `src/core/pluginApi.ts` and `src/core/themeApi.ts` for extension interfaces

## License

MIT
