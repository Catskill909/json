import { buildTypeModel, type TypeDescriptor, type ObjectDefinition } from "./typeModel";

export interface JsonToTsOptions {
  rootName?: string;
}

export function jsonToTs(data: unknown, options?: JsonToTsOptions): string {
  const rootName = options?.rootName ?? "RootObject";
  const model = buildTypeModel(data, rootName);
  const lines: string[] = [];

  if (model.rootType.kind !== "object") {
    lines.push(`export type ${rootName} = ${renderTypeScriptType(model.rootType)};`);
  }

  model.objects.forEach((obj) => {
    lines.push(renderInterface(obj));
  });

  return lines.join("\n\n");
}

function renderInterface(def: ObjectDefinition): string {
  const fields = def.fields
    .map((field) => {
      const propertyName = isValidIdentifier(field.key)
        ? field.key
        : `'${field.key.replace(/'/g, "\\'")}'`;
      const typeAnnotation = renderTypeScriptType(field.type);
      return `  ${propertyName}: ${typeAnnotation};`;
    })
    .join("\n");

  return `export interface ${def.name} {\n${fields}\n}`;
}

function renderTypeScriptType(descriptor: TypeDescriptor): string {
  switch (descriptor.kind) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "any":
      return "unknown";
    case "number":
      return "number";
    case "object":
      return descriptor.refName;
    case "array":
      return renderArrayType(descriptor.elementTypes);
    default:
      return "unknown";
  }
}

function renderArrayType(elementDescriptors: TypeDescriptor[]): string {
  if (elementDescriptors.length === 0) {
    return "unknown[]";
  }
  const uniqueTypes = Array.from(
    new Set(elementDescriptors.map((descriptor) => renderTypeScriptType(descriptor))),
  );
  if (uniqueTypes.length === 1 && !uniqueTypes[0].includes("|")) {
    return `${uniqueTypes[0]}[]`;
  }
  return `Array<${uniqueTypes.join(" | ")}>`;
}

function isValidIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
}
