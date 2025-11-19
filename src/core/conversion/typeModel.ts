export type NumberKind = "int" | "double";

export type TypeDescriptor =
  | { kind: "string" }
  | { kind: "boolean" }
  | { kind: "null" }
  | { kind: "any" }
  | { kind: "number"; numericKind: NumberKind }
  | { kind: "object"; refName: string }
  | { kind: "array"; elementTypes: TypeDescriptor[] };

export interface FieldDefinition {
  key: string;
  identifier: string;
  type: TypeDescriptor;
}

export interface ObjectDefinition {
  name: string;
  fields: FieldDefinition[];
}

export interface TypeModel {
  rootType: TypeDescriptor;
  objects: ObjectDefinition[];
}

export function buildTypeModel(data: unknown, rootHint = "RootObject"): TypeModel {
  const objects: ObjectDefinition[] = [];
  const shapeToName = new Map<string, string>();
  const nameCounts = new Map<string, number>();

  const ensureName = (base: string) => {
    const cleaned = base || "GeneratedType";
    const normalized = toPascalCase(cleaned);
    const count = nameCounts.get(normalized) ?? 0;
    nameCounts.set(normalized, count + 1);
    return count === 0 ? normalized : `${normalized}${count + 1}`;
  };

  const registerObject = (value: Record<string, unknown>, hint: string): string => {
    const signature = getShapeSignature(value);
    const existing = shapeToName.get(signature);
    if (existing) {
      return existing;
    }

    const name = ensureName(hint || "GeneratedObject");
    shapeToName.set(signature, name);

    const def: ObjectDefinition = {
      name,
      fields: [],
    };
    objects.push(def);

    const usedIdentifiers = new Set<string>();

    def.fields = Object.entries(value).map(([key, fieldValue]) => {
      const identifier = ensureIdentifier(makeIdentifier(key), usedIdentifiers);
      usedIdentifiers.add(identifier);
      return {
        key,
        identifier,
        type: describe(fieldValue, key),
      };
    });

    return name;
  };

  const describe = (value: unknown, hint: string): TypeDescriptor => {
    if (value === null || value === undefined) {
      return { kind: "null" };
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { kind: "array", elementTypes: [{ kind: "any" }] };
      }

      const elements: TypeDescriptor[] = [];
      const seen = new Set<string>();
      for (const item of value) {
        const descriptor = describe(item, singularize(hint));
        const key = descriptorKey(descriptor);
        if (!seen.has(key)) {
          seen.add(key);
          elements.push(descriptor);
        }
      }
      return { kind: "array", elementTypes: elements.length ? elements : [{ kind: "any" }] };
    }

    switch (typeof value) {
      case "string":
        return { kind: "string" };
      case "number":
        return { kind: "number", numericKind: Number.isInteger(value) ? "int" : "double" };
      case "boolean":
        return { kind: "boolean" };
      case "object":
        return { kind: "object", refName: registerObject(value as Record<string, unknown>, hint) };
      default:
        return { kind: "any" };
    }
  };

  const rootType = describe(data, rootHint);

  return {
    rootType,
    objects,
  };
}

function descriptorKey(descriptor: TypeDescriptor): string {
  switch (descriptor.kind) {
    case "string":
    case "boolean":
    case "null":
    case "any":
      return descriptor.kind;
    case "number":
      return `${descriptor.kind}:${descriptor.numericKind}`;
    case "object":
      return `object:${descriptor.refName}`;
    case "array":
      return `array<${descriptor.elementTypes.map(descriptorKey).sort().join("|")}>`;
    default:
      return "any";
  }
}

function getShapeSignature(value: Record<string, unknown>): string {
  const entries = Object.entries(value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}:${shapeOf(val)}`);
  return `object{${entries.join(",")}}`;
}

function shapeOf(value: unknown): string {
  if (value === null || value === undefined) {
    return "null";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "array<any>";
    }
    return `array<${value.map(shapeOf).join("|")}>`;
  }
  if (typeof value === "object") {
    return getShapeSignature(value as Record<string, unknown>);
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "double";
  }
  return typeof value;
}

function singularize(name: string): string {
  if (!name) return "Item";
  if (name.endsWith("s") && name.length > 1) {
    return name.slice(0, -1);
  }
  if (/ies$/i.test(name)) {
    return name.slice(0, -3) + "y";
  }
  return `${name}Item`;
}

function toPascalCase(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join("");
}

function makeIdentifier(key: string): string {
  const normalized = key
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((segment, index) =>
      index === 0
        ? segment.toLowerCase()
        : segment[0].toUpperCase() + segment.slice(1).toLowerCase(),
    )
    .join("");

  return normalized || "field";
}

function ensureIdentifier(candidate: string, used: Set<string>): string {
  if (!used.has(candidate)) {
    return candidate;
  }
  let counter = 2;
  let next = `${candidate}${counter}`;
  while (used.has(next)) {
    counter += 1;
    next = `${candidate}${counter}`;
  }
  return next;
}
