# Changelog

All notable changes to SuperSoul JSON Tool will be documented in this file.

## [2.1.0] - 2025-11-19

### Added - Format Conversion Panel (Feature Spec 1)

#### Core Conversion Engine
- **New module**: `src/core/conversion/` with registry-driven conversion API
- **Supported formats**:
  - JSON → YAML (via `js-yaml`)
  - JSON → CSV with intelligent flattening (via `@json2csv/plainjs`)
  - JSON → XML (via `fast-xml-parser`)
  - JSON → TypeScript Interfaces (custom generator with type inference)
  - JSON → Dart Classes (custom generator with fromJson/toJson methods)
  - JSON → Pretty/Minified

#### Type System
- **Type model builder** (`typeModel.ts`): Analyzes JSON structure and generates type definitions
- **Smart type inference**: Detects objects, arrays, primitives, and nested structures
- **Deduplication**: Reuses identical object shapes across the document
- **Identifier normalization**: Converts JSON keys to valid TypeScript/Dart identifiers

#### UI/UX Enhancements
- **Format dropdown** in ControlsBar: One-click access to all conversion options
- **Dedicated conversion pane**: Non-destructive output display with:
  - Syntax highlighting based on output format (JSON, YAML, XML, TypeScript, Dart, CSV)
  - Copy/Download/Close controls
  - Format label and language indicator
  - Error messaging for invalid JSON or empty documents
- **State management**: Conversion pane resets when source JSON changes
- **Layout flexibility**: Right pane visibility controlled dynamically

#### Documentation Updates
- Updated `HelpModal` with Format Conversion Panel feature and XML/RSS support
- Enhanced `README.md` with conversion engine architecture details
- Added Feature Spec 1 to `ROADMAP.md` with implementation notes
- Bumped version to 2.1.0 in `package.json`

### Fixed
- Resolved `json2csv` dependency issue by migrating to `@json2csv/plainjs`
- Added custom flatten helper for CSV output to handle nested objects/arrays

### Technical Details
- **Dependencies added**: `js-yaml`, `@json2csv/plainjs`, `@types/js-yaml`
- **Architecture**: Registry pattern for extensible format support
- **Error handling**: Validates JSON before conversion, displays user-friendly errors
- **Performance**: Client-side processing, no server round-trips

---

## [2.0.0] - 2025-11-18

### Added - JSON Schema Validation
- Full JSON Schema validation support (Draft 7, 2019-09, 2020-12)
- Schema validator modal with detailed error reporting
- Sample schemas for quick testing
- Auto-validation with 500ms debounce

### Added - XML/RSS/Atom Feed Support
- Auto-detection of JSON, RSS, Atom, and generic XML feeds
- XML → JSON conversion using `fast-xml-parser`
- Feed type indicators in status messages
- Documented in `more-type-feeds.md`

### Added - Enhanced Formatting
- Custom formatting options (indent size, quote style, trailing commas)
- Settings modal for user preferences
- Format persistence across sessions

### Fixed
- Enhanced error messages with line/column numbers
- Improved drag & drop file upload UX
- CORS proxy environment detection (`src/utils/env.ts`)

---

## [1.0.0] - 2025-11-15

### Initial Release
- Monaco Editor integration with syntax highlighting
- Prettify/Minify JSON
- Copy to clipboard and download functionality
- Dark/Light theme toggle
- Drag & drop file upload
- URL fetch with CORS proxy
- Client-side processing (privacy-first)
- Responsive design with modern UI
- Font Awesome icons with smooth animations
- Glassmorphism tooltips

---

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for upcoming features:
- **Priority 3**: Diff/Change Comparison Mode
- **Future**: JSONPath query mode, auto-fix suggestions, history/bookmarks, browser extensions
