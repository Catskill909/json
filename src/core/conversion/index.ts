import { jsonToYaml } from "./jsonToYaml";
import { jsonToCsv } from "./jsonToCsv";
import { jsonToXml } from "./jsonToXml";
import { jsonToTs } from "./jsonToTs";
import { jsonToDart } from "./jsonToDart";

export type ConversionFormat =
  | "json_pretty"
  | "json_minified"
  | "yaml"
  | "csv"
  | "xml"
  | "ts"
  | "dart";

export type ConversionLanguage = "json" | "yaml" | "xml" | "typescript" | "dart" | "plaintext";

export interface ConversionResult {
  format: ConversionFormat;
  label: string;
  language: ConversionLanguage;
  content: string;
}

interface ConversionTarget {
  format: ConversionFormat;
  label: string;
  language: ConversionLanguage;
  convert: (value: unknown) => string;
}

const registry: Record<ConversionFormat, ConversionTarget> = {
  json_pretty: {
    format: "json_pretty",
    label: "JSON (pretty)",
    language: "json",
    convert: (value: unknown) => JSON.stringify(value, null, 2),
  },
  json_minified: {
    format: "json_minified",
    label: "JSON (minified)",
    language: "json",
    convert: (value: unknown) => JSON.stringify(value),
  },
  yaml: {
    format: "yaml",
    label: "YAML",
    language: "yaml",
    convert: (value: unknown) => jsonToYaml(value),
  },
  csv: {
    format: "csv",
    label: "CSV",
    language: "plaintext",
    convert: (value: unknown) => jsonToCsv(value),
  },
  xml: {
    format: "xml",
    label: "XML",
    language: "xml",
    convert: (value: unknown) => jsonToXml(value),
  },
  ts: {
    format: "ts",
    label: "TypeScript Interfaces",
    language: "typescript",
    convert: (value: unknown) => jsonToTs(value),
  },
  dart: {
    format: "dart",
    label: "Dart Classes",
    language: "dart",
    convert: (value: unknown) => jsonToDart(value),
  },
};

export const conversionOptions = Object.values(registry).map(({ format, label, language }) => ({
  format,
  label,
  language,
}));

export function convertValue(value: unknown, format: ConversionFormat): ConversionResult {
  const target = registry[format];
  if (!target) {
    throw new Error(`Unsupported conversion format: ${format}`);
  }

  const content = target.convert(value);

  return {
    format: target.format,
    label: target.label,
    language: target.language,
    content,
  };
}
