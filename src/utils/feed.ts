import { XMLParser } from 'fast-xml-parser';

export type FeedType = 'json' | 'xml' | 'unknown';

/**
 * Detects the type of feed based on content and Content-Type header.
 */
export function detectFeedType(content: string, contentType: string = ''): FeedType {
  const trimmed = content.trim();
  
  // Check for JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    return 'json';
  }

  // Check for XML/RSS/Atom
  // Common XML preludes: <?xml ... ?>, <rss ...>, <feed ...>
  if (trimmed.startsWith('<') || (trimmed.startsWith('<?xml') && trimmed.includes('>'))) {
    return 'xml';
  }

  // Fallback to content-type
  if (contentType.toLowerCase().includes('json')) return 'json';
  if (contentType.toLowerCase().includes('xml') || contentType.toLowerCase().includes('rss')) return 'xml';

  return 'unknown';
}

/**
 * Converts XML/RSS/Atom content to a JSON string.
 */
export function convertXmlToJson(content: string): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    parseTagValue: true,
    trimValues: true,
  });
  
  try {
    const jObj = parser.parse(content);
    return JSON.stringify(jObj, null, 2);
  } catch (e) {
    console.error("XML Conversion failed", e);
    throw new Error("Failed to convert XML to JSON");
  }
}
