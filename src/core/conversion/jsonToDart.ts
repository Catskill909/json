import { buildTypeModel, type TypeDescriptor, type ObjectDefinition } from "./typeModel";

export interface JsonToDartOptions {
  rootName?: string;
}

export function jsonToDart(data: unknown, options?: JsonToDartOptions): string {
  const rootName = options?.rootName ?? "RootObject";
  const model = buildTypeModel(data, rootName);
  const lines: string[] = [];

  model.objects.forEach((obj) => {
    lines.push(renderClass(obj));
  });

  if (model.rootType.kind !== "object") {
    lines.unshift(`typedef ${rootName} = ${dartType(model.rootType)};`);
  }

  return lines.join("\n\n");
}

function renderClass(def: ObjectDefinition): string {
  const fieldLines = def.fields
    .map((field) => `  final ${dartType(field.type)} ${field.identifier};`)
    .join("\n");

  const constructorLines = def.fields
    .map((field) => `    required this.${field.identifier},`)
    .join("\n");

  const fromJsonAssignments = def.fields
    .map((field) => `      ${field.identifier}: ${dartFromJson(field.type, `json['${field.key}']`)},`)
    .join("\n");

  const toJsonEntries = def.fields
    .map((field) => `      '${field.key}': ${dartToJson(field.type, field.identifier)},`)
    .join("\n");

  return `class ${def.name} {\n${fieldLines}\n\n  ${def.name}({\n${constructorLines}\n  });\n\n  factory ${def.name}.fromJson(Map<String, dynamic> json) => ${def.name}(\n${fromJsonAssignments}\n  );\n\n  Map<String, dynamic> toJson() => {\n${toJsonEntries}\n  };\n}`;
}

function dartType(descriptor: TypeDescriptor): string {
  switch (descriptor.kind) {
    case "string":
      return "String";
    case "boolean":
      return "bool";
    case "null":
      return "dynamic";
    case "any":
      return "dynamic";
    case "number":
      return descriptor.numericKind === "int" ? "int" : "double";
    case "object":
      return descriptor.refName;
    case "array":
      return `List<${arrayElementType(descriptor.elementTypes)}>`;
    default:
      return "dynamic";
  }
}

function arrayElementType(descriptors: TypeDescriptor[]): string {
  if (!descriptors.length) return "dynamic";
  const unique = Array.from(new Set(descriptors.map((item) => dartType(item))));
  if (unique.length === 1) {
    return unique[0];
  }
  return "dynamic";
}

function dartFromJson(descriptor: TypeDescriptor, accessor: string): string {
  switch (descriptor.kind) {
    case "string":
      return `${accessor} as String? ?? ''`;
    case "boolean":
      return `${accessor} as bool? ?? false`;
    case "number":
      return descriptor.numericKind === "int"
        ? `${accessor} is int ? ${accessor} as int : (${accessor} as num?)?.toInt() ?? 0`
        : `${accessor} is double ? ${accessor} as double : (${accessor} as num?)?.toDouble() ?? 0.0`;
    case "object":
      return `${accessor} != null ? ${descriptor.refName}.fromJson(${accessor} as Map<String, dynamic>) : ${descriptor.refName}.fromJson({})`;
    case "array":
      return `(${accessor} as List<dynamic>? ?? [])\n          .map((e) => ${dartFromJson(descriptor.elementTypes[0] ?? { kind: "any" }, "e")})\n          .toList()`;
    case "null":
    case "any":
    default:
      return accessor;
  }
}

function dartToJson(descriptor: TypeDescriptor, identifier: string): string {
  switch (descriptor.kind) {
    case "object":
      return `${identifier}.toJson()`;
    case "array":
      return `${identifier}.map((e) => ${dartArrayToJson(descriptor.elementTypes[0] ?? { kind: "any" }, "e")}).toList()`;
    default:
      return identifier;
  }
}

function dartArrayToJson(descriptor: TypeDescriptor, identifier: string): string {
  if (descriptor.kind === "object") {
    return `${identifier}.toJson()`;
  }
  return identifier;
}
