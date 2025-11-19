# Multi-Format Feed Architecture

## Goal
Expand the JSON Tool to automatically detect and handle other feed formats, specifically RSS, Atom, and general XML, in addition to the existing JSON support. The tool should allow users to input a URL (like a podcast feed), automatically detect the format, and convert it to a structured JSON representation for viewing and editing in the existing editor.

## Architecture

### 1. Feed Detection (Auto-Sensing)
We need a robust mechanism to detect the feed type. We cannot rely solely on the `Content-Type` header, as some feeds might serve XML with `text/plain` or other generic types.

**Strategy:**
1.  **Header Check**: Check `Content-Type` header from the fetch response.
2.  **Content Sniffing**: If header is ambiguous or indicates text/xml, inspect the first few bytes of the content.
    *   `<?xml ... ?>` -> XML
    *   `<rss ...>` -> RSS
    *   `<feed ...>` -> Atom
    *   `{` or `[` -> JSON

### 2. Feed Conversion Layer
Since the core tool is built around JSON, non-JSON feeds will be converted to a JSON representation. This allows us to reuse the existing:
*   Monaco Editor (syntax highlighting, folding)
*   Tree View (planned)
*   Validation logic (conceptually, though JSON Schema won't apply directly to the original XML)
*   Formatting/Minifying

**Converter Implementation:**
*   Use a library like `fast-xml-parser` to convert XML/RSS/Atom strings into JSON objects.
*   Preserve attributes and structure as much as possible.

### 3. Pipeline Modification

**Current Flow:**
`Fetch URL` -> `res.text()` -> `setInputValue` -> `JSON.parse` -> `Display`

**New Flow:**
`Fetch URL` -> `res.text()` -> **`Detect Format`** ->
*   **If JSON**: `setInputValue` -> `JSON.parse` -> `Display`
*   **If XML/RSS**: **`Convert to JSON`** -> `setInputValue` (as JSON string) -> `JSON.parse` -> `Display`
    *   *Note*: We might want to store the *original* source separately if we want to allow editing the original XML, but for now, viewing as JSON is the primary goal.

## Implementation Plan

1.  **Dependencies**: Install `fast-xml-parser`. (Completed)
2.  **Utility Module**: Create `src/utils/feed.ts`. (Completed)
    *   `detectFeedType(content: string, contentType: string): 'json' | 'xml' | 'unknown'`
    *   `convertXmlToJson(content: string): string`
3.  **App Integration**: (Completed)
    *   Update `handleFetchUrl` in `App.tsx`.
    *   Add logic to handle the conversion step.
    *   Add UI feedback indicating "Converted from XML/RSS".

## Testing
*   Test with JSON URL.
*   Test with the provided Podcast URL: `https://archive.wjffradio.org/getrss.php?id=oldskoolsessio`
*   Test with generic XML.
