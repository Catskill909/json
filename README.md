# JSON Tool

A cutting-edge, extensible JSON formatter and validator for developers, featuring:

- Modern Material Design-inspired dark mode interface
- Side-by-side raw/pretty panes with all controls/messages above
- Input via direct text or URL fetch
- Real-time validation, error highlighting, copy/download
- Modular architecture for plugins, custom themes, schema validation, diffing, collaboration, and more

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
