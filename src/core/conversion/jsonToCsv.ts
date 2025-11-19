import { Parser } from "@json2csv/plainjs";

type RecordValue = Record<string, unknown>;

function isPlainObject(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function flattenRecord(value: RecordValue): RecordValue {
  const result: RecordValue = {};

  const visit = (node: unknown, path: string[]) => {
    if (node === null || node === undefined) {
      result[path.join(".")] = node;
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, [...path, String(index)]));
      return;
    }
    if (isPlainObject(node)) {
      Object.entries(node).forEach(([key, val]) => visit(val, [...path, key]));
      return;
    }
    result[path.join(".")] = node;
  };

  Object.entries(value).forEach(([key, val]) => visit(val, [key]));
  return result;
}

function normalizeData(value: unknown): RecordValue[] {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return value.map((item, index) => {
      if (isPlainObject(item)) return item;
      return { index, value: item };
    });
  }

  if (isPlainObject(value)) {
    return [value];
  }

  return [{ value }];
}

export function jsonToCsv(data: unknown): string {
  const rows = normalizeData(data).map(flattenRecord);
  const parser = new Parser({
    header: true,
    defaultValue: "",
  });

  return rows.length ? parser.parse(rows) : "";
}
